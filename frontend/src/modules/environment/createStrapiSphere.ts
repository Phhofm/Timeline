import * as THREE from 'three';
import strapiEvent from '../../classes/strapiEvent';
import TimeLine from "../../timeLine";

//@ts-ignore
export default (timeline: TimeLine, strapiEventObject: strapiEvent, timelineLineWidth: number, dateLineSpaceUnit: number, eventTypes: string[], sphere_geometry: THREE.SphereBufferGeometry) => {

    let color = '#000000';

    // events of same type get same color.

    if (strapiEventObject.type !== null) {
        console.log("type:")
        //@ts-ignore
        console.log(strapiEventObject.type.id);
        console.log(strapiEventObject.title);
        // since we stored types as an array of javascript objects, we need to find the specific type object belonging to this event (the type id from the event)
        var result = timeline.eventTypes.filter(obj => {
            //@ts-ignore
            return obj.id === strapiEventObject.type.id
        })

        console.log("result");
        console.log(result);
        console.log(result.length);
        console.log(strapiEventObject);

        if (result.length > 0) {
            // note: what we do here, we simply take the color from the colors array that index is the same as id. This is from a prevoious code approach before fetching objects.
            // this simply guarantees the same color. Better would be for the user to define color within strapi for a type, and actually use the color of this type as specified by the user through strapi
            // in strapi we can define a list of colors, the css color codes, and use them here.
            console.log(timeline.eventPlaneColors);
            console.log(timeline.eventPlaneColors.length);

            //@ts-ignore
            if (strapiEventObject.type.id == 1) { // Rechtswissen
                color = "#0000FF";
                //@ts-ignore
            } else if (strapiEventObject.type.id == 2) {  // Events
                color = "#FFC0CB";
                //@ts-ignore
            } else if (strapiEventObject.type.id == 3) {  // Rechtlicher Normativität
                color = "#FFFF00";
                //@ts-ignore
            } else if (strapiEventObject.type.id == 4) { // Personen
                color = "#FF0000";
                //@ts-ignore
            } else if (strapiEventObject.type.id == 5) {
                color = "#FFC0CB";
            }



            /*
                        //@ts-ignore
                        if (timeline.eventPlaneColors.length >= strapiEventObject.type.id) { // gets a color from the provided color range. first check if there are enough colors provided to not make an out-of-bounds access.
                            //@ts-ignore
                            color = timeline.eventPlaneColors[strapiEventObject.type.id]; // is number
                        } else { // if not enough colors provided -> random color to prevent out-of-bounds
                            color = '#000000'; // random color. is string.
                        }*/
        } else { // if we cannot find the type we also give a random color
            color = '#000000'; // random color. is string.
        }
    } else {
        color = '#000000'; // random color. is string.
    };

    console.log("COLOR");
    console.log(color)

    //let material = new THREE.LineBasicMaterial({color: color});
    let material = new THREE.MeshBasicMaterial({
        color: color
    });
    material.wireframe = timeline.eventWireFrame;
    material.wireframeLinewidth = 1.2;

    console.log(material.color);

    let sphere = new THREE.Mesh(sphere_geometry, material);

    //  evenly distribute them, if the list is sorted after dates then a rotater should be enough
    let placementX: number = -((timeline.bars - 1) * (timelineLineWidth / 2)) + (timeline.eventPlanePlacementRotater * timelineLineWidth);
    let barsCorrector = 1;

    if (timeline.eventPlanePlacementRotater < timeline.bars - barsCorrector) {
        timeline.eventPlanePlacementRotater++;
    } else {
        timeline.eventPlanePlacementRotater = 0;
    }

    sphere.translateX(placementX); // adjust this to put it on the correct timebar

    // Y placement
    sphere.translateY(2 * timeline.scale); // so it is on top

    // Z placement logic
    const planeEventStart = -(dateLineSpaceUnit * strapiEventObject.startyear);
    sphere.translateZ(planeEventStart); // adjust to put it into the correct timezone

    sphere.rotateX(THREE.Math.degToRad(90)); // for planes, this was to lay them flat on the ground. For spheres, it is so they look more interesting and ligned out.

    sphere.userData = {
        Clicked: false
    };

    return sphere;

}