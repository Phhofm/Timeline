import * as THREE from 'three';
import strapiTimespan from '../../classes/strapiTimespan';
import TimeLine from "../../timeLine";

//@ts-ignore
export default (timeline: TimeLine, strapiTimespanObject: strapiTimespan, timelineLineWidth: number, dateLineSpaceUnit: number, eventTypes: string[]) => {

    const sphere_geometry = new THREE.SphereGeometry(timeline.sphereRadius, timeline.sphereWidthSegments, timeline.sphereHeightSegments);

    let color = '#FFFFFF';

    //let material = new THREE.LineBasicMaterial({color: color});
    let material = new THREE.MeshBasicMaterial({
        color: color
    });
    material.wireframe = timeline.eventWireFrame;
    material.wireframeLinewidth = 1.2;

    let sphere = new THREE.Mesh(sphere_geometry, material);

    //  evenly distribute them, if the list is sorted after dates then a rotater should be enough
    //let placementX: number = -((timeline.bars - 1) * (timelineLineWidth / 2)) + (timeline.eventPlanePlacementRotater * timelineLineWidth);
    let placementX: number = 31;

    let barsCorrector = 1;

    if (timeline.eventPlanePlacementRotater < timeline.bars - barsCorrector) {
        timeline.eventPlanePlacementRotater++;
    } else {
        timeline.eventPlanePlacementRotater = 0;
    }

    sphere.translateX(placementX); // adjust this to put it on the correct timebar

    // Y placement
    sphere.translateY(timeline.scale + 0.1); // so it is on top

    // Z placement logic
    let middlePre = strapiTimespanObject.endyear - strapiTimespanObject.startyear;
    let middle = middlePre / 2 + strapiTimespanObject.startyear;
    const planeEventStart = -(dateLineSpaceUnit * middle);
    sphere.translateZ(planeEventStart); // adjust to put it into the correct timezone

    sphere.rotateX(THREE.Math.degToRad(90)); // for planes, this was to lay them flat on the ground. For spheres, it is so they look more interesting and ligned out.

    sphere.userData = {
        Clicked: false
    };

    return sphere;

}