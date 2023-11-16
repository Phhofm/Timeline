import * as THREE from "three";
import strapiTimespan from "../../classes/strapiTimespan";
import strapiEvent from "../../classes/strapiEvent";

/* DRAW CURVES */
// shows connectivity of Events by connecting them with curved lines. This can be used for example then an Event is clicked to show connected events
// or if there is a topic selection to show all Events belonging to this topic. Depends on the data and on the usecase.
/**********************************************************************************************************************/

export default (
  eventObject: strapiEvent & strapiTimespan,
  sphere2: any,
  scene: any
) => {
  let yPosition = 10; // how high the curve will go. mid1 and mid2 are the intermediate points, functioning like the middle points in the CubicBezierCurve3
  let sphere1 = eventObject._correspondingMesh; // we give as input the whole object, and extract the sphere from it in this method. Since we have the Object now, we can also store the drawn curve-references in it, so when dismissing, we can remove the drawn curves from the scene through these references.

  // sphere1 positions
  let sphere1PositionX = sphere1.position.x;
  let sphere1PositionY = sphere1.position.y;
  let sphere1PositionZ = sphere1.position.z;

  // sphere2 positions
  let sphere2PositionX = sphere2.position.x;
  let sphere2PositionY = sphere2.position.y;
  let sphere2PositionZ = sphere2.position.z;

  // mid1 positions
  let mid1PositionX =
    sphere1PositionX - (sphere1PositionX - sphere2PositionX) / 3;
  let mid1PositionY = yPosition;
  let mid1PositionZ =
    sphere1PositionZ - (sphere1PositionZ - sphere2PositionZ) / 3;

  //mid2 positions
  let mid2PositionX = mid1PositionX - (sphere1PositionX - sphere2PositionX) / 3;
  let mid2PositionY = yPosition;
  let mid2PositionZ = mid1PositionZ - (sphere1PositionZ - sphere2PositionZ) / 3;

  let curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(sphere1PositionX, sphere1PositionY, sphere1PositionZ),
    new THREE.Vector3(mid1PositionX, mid1PositionY, mid1PositionZ),
    new THREE.Vector3(mid2PositionX, mid2PositionY, mid2PositionZ),
    new THREE.Vector3(sphere2PositionX, sphere2PositionY, sphere2PositionZ),
  ]);
  let points = curve.getPoints(500);
  let geometry = new THREE.BufferGeometry().setFromPoints(points);
  let material = new THREE.LineBasicMaterial({
    color: 0xff0000,
  });

  // Create the final object to add to the scene
  let curveObject = new THREE.Line(geometry, material);
  eventObject._relatedCurves.push(curveObject); //we add it to the object so we can remove lines from scene when dismissed
  scene.add(curveObject); // TODO add to group, add group to scene, when removing a line remove it from the group, or add it to the group. For example when clicking event we can clean/empty the whole Group and add all curves to the Group. Or have all lines in the Group and simply change the visible status
};

/**********************************************************************************************************************/
/* END OF DRAW CURVES */
