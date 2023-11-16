import * as THREE from "three";
import TimeLine from "../../timeLine";
import strapiTimespan from "../../classes/strapiTimespan";
import strapiEra from "../../classes/strapiEra";

/* BUILD WHOLE TIMELINE */
// build the timeline, the datelines and the dates as 3d text elements
/**********************************************************************************************************************/
//export function buildWorld(timeline: TimeLine, scene: THREE.Scene, timelineLineWidth: number, timelineLineHeight: number, timelineEndDate: number, dateLineSpace: number) {
export default (
  timeline: TimeLine,
  scene: THREE.Scene,
  timelineLineWidth: number,
  timelineLineHeight: number,
  timelineEndDate: number,
  dateLineSpace: number,
  strapiTimespanObjects: strapiTimespan[],
  strapiEraObjects: strapiEra[]
  // defaultEventObjects?: any,
  //rightEventObjects?: any
) => {
  let timelineFrameGroup: THREE.Group = new THREE.Group();
  timelineFrameGroup.name = "TimelineFrameGroup";
  timelineFrameGroup = buildTimeline(
    timeline,
    timeline.bars,
    timelineLineWidth,
    timelineLineHeight,
    timelineFrameGroup
  );
  timelineFrameGroup = createDateLines(
    timeline,
    timelineLineWidth,
    timelineEndDate,
    dateLineSpace,
    timelineFrameGroup
  );
  timelineFrameGroup = createDateTextElements(
    timeline,
    timelineLineWidth,
    timelineEndDate,
    dateLineSpace,
    timelineFrameGroup
  );
  if (strapiEraObjects) {
    timelineFrameGroup = createDatePeriodLeft(
      timeline,
      timelineLineWidth,
      dateLineSpace,
      timelineFrameGroup,
      strapiEraObjects
    );
  }
  if (strapiTimespanObjects) {
    timelineFrameGroup = createDatePeriodRight(
      timeline,
      timelineLineWidth,
      dateLineSpace,
      timelineFrameGroup,
      strapiTimespanObjects
    );
  }
  scene.add(timelineFrameGroup);
  return timelineFrameGroup;
};

// build the timeline bars into a group and make transformations
const buildTimeline = (
  timeline: TimeLine,
  bars: number,
  timelineLineWidth: number,
  timelineLineHeight: number,
  timelineFrameGroup: THREE.Group
) => {
  const timelineGroup: THREE.Group = new THREE.Group(); // Group to hold timeline bars. Transformations on the Group will be applied to all its containing children
  let x: number;
  for (let i: number = 0; i <= bars; i++) {
    x = -(((bars - 1) * timelineLineWidth) / 2) + i * timelineLineWidth; // calculate placement of bar on x-axis
    const borderLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial(
      {
        color: timeline.timelineColor,
      }
    );

    const points = [];
    points.push(new THREE.Vector3(
      x - timelineLineWidth / 2,
      -0.5,
      timelineLineHeight + 1000
    ));
    points.push(new THREE.Vector3(
      x - timelineLineWidth / 2,
      -0.5,
      -(timelineLineHeight + 1000)
    ));
    const borderLineGeometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const borderLine: THREE.Line = new THREE.Line(
      borderLineGeometry,
      borderLineMaterial
    ); // create line
    borderLine.rotateX(THREE.Math.degToRad(90));
    timelineGroup.add(borderLine); // add to mainScene
  }

  timelineGroup.rotateX(THREE.Math.degToRad(90)); // translation so timeline is flat on the ground
  timelineGroup.name = "TimeLineGroup";
  timelineFrameGroup.add(timelineGroup);
  return timelineFrameGroup;
};

const createDateLines = (
  timeline: any,
  timelineLineWidth: number,
  timelineEndDate: number,
  dateLineSpace: number,
  timelineFrameGroup: THREE.Group
) => {
  let dateLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({
    color: timeline.timelineColor,
  });
  let dateLinePosition: number = 0;
  let fineGrainedPosition: number = 0;

  for (let i: number = 0; i <= timelineEndDate / 100 + 8; i++) {
    // +1 so there is a line at the end of the last date. Changed to +8 because of infinity request

    fineGrainedPosition = dateLinePosition;
    // finegrained lines in between with no date (user request)
    for (let i: number = 0; i < 9; i++) {
      // Anno Domini
      fineGrainedPosition -= dateLineSpace / 10; // decrease dateLinePosition to go to the future. do it first so grey does not overwrite black dateline
      // create Geometry with Vertices (lines are drawn between consecutive vertices)

      let points = [];
      points.push(new THREE.Vector3(
        -timeline.bars * (timelineLineWidth / 2) - 3,
        0.3 * timeline.scale,
        fineGrainedPosition
      ));
      points.push(new THREE.Vector3(
        timeline.bars * (timelineLineWidth / 2) + 0.5,
        0.3 * timeline.scale,
        fineGrainedPosition
      ));

      let fineGrainedGeometry: THREE.BufferGeometry = new THREE.BufferGeometry().setFromPoints(points);

      let fineGrained = new THREE.Line(
        fineGrainedGeometry,
        new THREE.LineBasicMaterial({
          color: timeline.timelineColor,
        })
      ); // create line
      timelineFrameGroup.add(fineGrained);

      // Before Christ. See comments above for reference

      points = [];
      points.push(
        new THREE.Vector3(
          -timeline.bars * (timelineLineWidth / 2) - 3,
          0.3 * timeline.scale,
          fineGrainedPosition * -1
        ));
      points.push(new THREE.Vector3(
        timeline.bars * (timelineLineWidth / 2) + 0.5,
        0.3 * timeline.scale,
        fineGrainedPosition * -1
      ));

      fineGrainedGeometry = new THREE.BufferGeometry().setFromPoints(points);

      fineGrained = new THREE.Line(
        fineGrainedGeometry,
        new THREE.LineBasicMaterial({
          color: timeline.timelineColor,
        })
      ); // create line
      timelineFrameGroup.add(fineGrained);
    }

    // the non-finegrained big lines

    let points = [];
    points.push(
      new THREE.Vector3(
        -(timeline.bars + 1) * (timelineLineWidth / 2),
        0.3 * timeline.scale,
        dateLinePosition
      ));
    points.push(new THREE.Vector3(
      (timeline.bars + 1) * (timelineLineWidth / 2) - 6,
      0.3 * timeline.scale,
      dateLinePosition
    ));

    let dateLineGeometryLoop = new THREE.BufferGeometry().setFromPoints(points);

    const dateLineLoop: THREE.Line = new THREE.Line(
      dateLineGeometryLoop,
      dateLineMaterial
    );
    timelineFrameGroup.add(dateLineLoop);
    dateLinePosition -= dateLineSpace;

    // into the past

    const dateLinePositionPast: number = dateLinePosition * -1;
    points = [];
    points.push(
      new THREE.Vector3(
        -(timeline.bars + 1) * (timelineLineWidth / 2),
        0.3 * timeline.scale,
        dateLinePositionPast
      ));
    points.push(new THREE.Vector3(
      (timeline.bars + 1) * (timelineLineWidth / 2) - 6,
      0.3 * timeline.scale,
      dateLinePositionPast
    ));

    dateLineGeometryLoop = new THREE.BufferGeometry().setFromPoints(points);

    const dateLineLoopPast: THREE.Line = new THREE.Line(
      dateLineGeometryLoop,
      dateLineMaterial
    );
    timelineFrameGroup.add(dateLineLoopPast);
  }
  return timelineFrameGroup;
};

// date text elements are created as 3D Objects and need to get placed at the right place in 3D space (above or next to the main datelines)
const createDateTextElements = (
  timeline: any,
  timelineLineWidth: number,
  timelineEndDate: number,
  dateLineSpace: number,
  timelineFrameGroup: THREE.Group
) => {
  let color: number;
  color = timeline.timelineColor;

  // load font
  const loader: THREE.FontLoader = new THREE.FontLoader();
  loader.load(timeline.font, (font) => {
    const matLite: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      side: THREE.DoubleSide,
    });

    let dateTextPosition: number = 0;
    let date: number = 0;
    for (let i: number = 0; i <= timelineEndDate / 100 + 8; i++) {
      // see createDateLine comment

      // Before Christ
      const pastDate: number = date * -1;
      const pastDateTextPosition: number = dateTextPosition * -1;
      let message: string = pastDate.toString();
      let shapes: any[] = font.generateShapes(message, 1.5 * timeline.scale, 0);
      let geometry: THREE.ShapeBufferGeometry = new THREE.ShapeBufferGeometry(
        shapes
      );
      geometry.computeBoundingBox();
      // make shape left ( N.B. edge view not visible )
      let textLeft: THREE.Mesh = new THREE.Mesh(geometry, matLite);
      textLeft.position.y = timeline.scale / 3 + 0.4;
      textLeft.position.x = -(timeline.bars + 1) * (timelineLineWidth / 2);
      textLeft.position.z = pastDateTextPosition;

      timelineFrameGroup.add(textLeft);

      // Anno Domini
      message = date.toString();
      shapes = font.generateShapes(message, 1.5 * timeline.scale, 0);
      geometry = new THREE.ShapeBufferGeometry(shapes);
      geometry.computeBoundingBox();
      // make shape left ( N.B. edge view not visible )
      textLeft = new THREE.Mesh(geometry, matLite);
      textLeft.position.y = timeline.scale / 3 + 0.4;
      textLeft.position.x = -(timeline.bars + 1) * (timelineLineWidth / 2);
      textLeft.position.z = dateTextPosition;

      timelineFrameGroup.add(textLeft);
      dateTextPosition -= dateLineSpace;
      date += 100;
    }
  });
  console.log("date created");
  return timelineFrameGroup;
};

// date period element on right side of timeline with defaultelements
const createDatePeriodLeft = (
  timeline: any,
  timelineLineWidth: number,
  dateLineSpace: number,
  timelineFrameGroup: THREE.Group,
  strapiEraObjects: strapiEra[]
) => {
  let colors = [
    "lime",
    "yellow",
    "cyan",
    "fuchsia",
    "deeppink",
    "honeydew",
    "white",
    "yellow",
  ];

  for (let i = 0; i < strapiEraObjects.length; i++) {
    let periodLineStartDate: number = strapiEraObjects[i].startyear;
    let periodLineEndDate: number = strapiEraObjects[i].endyear;
    let dateLineStartPosition: number =
      (periodLineStartDate / 100) * dateLineSpace * -1;
    let dateLineEndPosition: number =
      (periodLineEndDate / 100) * dateLineSpace * -1;
    let color = colors[i];
    let dateLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial(
      {
        color: color,
      }
    );

    // add each default Event (Epoch) to the indexed Array, we need this for the swipe controls, to show the user where the user/the camera is currently in
    timeline.indexedArrayDefaultEvents[
      strapiEraObjects[i].title
    ] = dateLineStartPosition;

    // timeperiod line

    let points = [];
    points.push(
      new THREE.Vector3(
        -(timeline.bars + 1) * (timelineLineWidth / 2) - 2,
        0.3 * timeline.scale + 2,
        dateLineStartPosition
      ));
    points.push(  new THREE.Vector3(
      -(timeline.bars + 1) * (timelineLineWidth / 2) - 2,
      0.3 * timeline.scale + 2,
      dateLineEndPosition
    ));

    let dateLineGeometryLoop = new THREE.BufferGeometry().setFromPoints(points);

    const dateLineLoop: THREE.Line = new THREE.Line(
      dateLineGeometryLoop,
      dateLineMaterial
    );
    timelineFrameGroup.add(dateLineLoop);

    // timeperiod text
    const loader: THREE.FontLoader = new THREE.FontLoader();
    loader.load(timeline.font, (font) => {
      const matLite: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
      });

      let dateTextPosition: number =
        ((periodLineStartDate + periodLineEndDate) / 2 / 100) *
        dateLineSpace *
        -1;

      let message = strapiEraObjects[i].title;
      let shapes = font.generateShapes(message, 1.5 * timeline.scale, 0);
      let geometry = new THREE.ShapeBufferGeometry(shapes);
      geometry.computeBoundingBox();

      let periodText = new THREE.Mesh(geometry, matLite);
      periodText.position.y = timeline.scale / 3 + 0.4 + 1.5 + 2;
      periodText.position.x =
        -(timeline.bars + 1.5) * (timelineLineWidth / 2) - 15;
      periodText.position.z = dateTextPosition;
      timelineFrameGroup.add(periodText);
    });
  }

  return timelineFrameGroup;
};

// date period element on right side of timeline with defaultelements
//@ts-ignore
const createDatePeriodRight = (
  timeline: any,
  timelineLineWidth: number,
  dateLineSpace: number,
  timelineFrameGroup: THREE.Group,
  strapiTimespanObjects: strapiTimespan[]
) => {
  let colors = [
    "red",
    "yellow",
    "lime",
    "springgreen",
    "cyan",
    "deepskyblue",
    "orange",
    "fuchsia",
    "deeppink",
  ];

  for (let i = 0; i < strapiTimespanObjects.length; i++) {
    let periodLineStartDate: number = strapiTimespanObjects[i].startyear;
    let periodLineEndDate: number = strapiTimespanObjects[i].endyear;
    let dateLineStartPosition: number =
      (periodLineStartDate / 100) * dateLineSpace * -1;
    let dateLineEndPosition: number =
      (periodLineEndDate / 100) * dateLineSpace * -1;
    let color = colors[i];
    let dateLineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial(
      {
        color: color,
      }
    );

    // timeperiod line

    let points = [];
    points.push(
      new THREE.Vector3(
        (timeline.bars + 1) * (timelineLineWidth / 2) - 2,
        0.3 * timeline.scale + 1,
        dateLineStartPosition
      ));
    points.push(  new THREE.Vector3(
      (timeline.bars + 1) * (timelineLineWidth / 2) - 2,
      0.3 * timeline.scale + 1,
      dateLineEndPosition
    ));

    let dateLineGeometryLoop = new THREE.BufferGeometry().setFromPoints(points);

    const dateLineLoop: THREE.Line = new THREE.Line(
      dateLineGeometryLoop,
      dateLineMaterial
    );
    timelineFrameGroup.add(dateLineLoop);

    // timeperiod text
    const loader: THREE.FontLoader = new THREE.FontLoader();
    loader.load(timeline.font, (font) => {
      const matLite: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
      });

      let dateTextPosition: number =
        ((periodLineStartDate + periodLineEndDate) / 2 / 100) *
        dateLineSpace *
        -1;

      let message = strapiTimespanObjects[i].title;
      let shapes = font.generateShapes(message, 1.5 * timeline.scale, 0);
      let geometry = new THREE.ShapeBufferGeometry(shapes);
      geometry.computeBoundingBox();

      let periodText = new THREE.Mesh(geometry, matLite);
      periodText.position.y = timeline.scale / 3 + 0.4 + 1.5;
      periodText.position.x =
        (timeline.bars + 1.8) * (timelineLineWidth / 2) - 7;
      periodText.position.z = dateTextPosition;
      timelineFrameGroup.add(periodText);
    });
  }

  return timelineFrameGroup;
};

/**********************************************************************************************************************/
/* END OF BUILD WHOLE TIMELINE */
