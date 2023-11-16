import setUpTHREEJSEnv from "./setUpTHREEJSEnv";
import buildBackground from "./buildBackground";
//@ts-ignore
import dataProcessing from "../data/dataProcessing";
import setUpControls from "../controls/setUpControls";
import { animate } from "../rendering/animate";
import addEventListeners from "../events/addEventListeners";

//classes import
import strapiEvent from "../../classes/strapiEvent";
import strapiTimespan from "../../classes/strapiTimespan";
import strapiEra from "../../classes/strapiEra";
import TimeLine from "../../timeLine";

/* INITIALIZE FUNCTION */
// Handles set up of scene, camera, renderer, controls, eventListeners and handles fetching and processing of data by calling functions.

/**********************************************************************************************************************/

export default async (timeline: TimeLine) => {
  console.log("initialize timeline ...");

  // disable all console outputs to keep browser console clean if parameter is set.
  if (timeline.disableConsoleOutput) {
    console.warn = () => {};
    console.log = () => {};
    console.debug = () => {};
    console.error = () => {};
    console.info = () => {};
  }

  /* CONTROL VARIABLES */
  /******************************************************************************************************************/
  const timelineLineWidth: number = timeline.scale * 13; // adapt width by changing the number.
  const dateLineSpace: number = timeline.scale * 140; // adapt dateLineSpace by changing the number.
  const dateLineSpaceUnit: number = dateLineSpace / 100; // adapt time steps by changing the number.

  /******************************************************************************************************************/

  /******************************************************************************************************************/

  /* SET UP THREEJS ENVIRONMENT */
  /******************************************************************************************************************/
  console.log("Threejs setup: Scene, Camera, Renderer ...");

  const __retSetUp: {
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
  } = setUpTHREEJSEnv(timeline);

  console.log("Setup complete.");

  /******************************************************************************************************************/

  /* BACKGROUND */
  /******************************************************************************************************************/
  console.log("build background ...");

  buildBackground(timeline);

  console.log("background complete.");

  /******************************************************************************************************************/

  /* SET UP AND RESTRICT CONTROLS */

  // this is not in setup because we need the returned values from the data fetched for start and end date for limitation of panning
  /******************************************************************************************************************/
  console.log("setting up controls ...");

  const controls = setUpControls(__retSetUp);

  console.log("controls done.");

  /******************************************************************************************************************/

  /* FETCH DATA AS JSON */
  // added await because right now a lot of logic is in fetchData that could be logically moved into other functions
  // but needs the fetching to be completed to not handle undefined data. Since we made this code synchronous now,
  // we can move functionality out of fetchData into other functions.
  /******************************************************************************************************************/
  console.log("retrieving and processing data ...");

  const __retFetchData: {
    timelineStartDate: number;
    timelineEndDate: number;
    strapiEventObjects: strapiEvent[];
    strapiEraObjects: strapiEra[];
    strapiTimespanObjects: strapiTimespan[];
  } = dataProcessing(
    timeline,
    __retSetUp,
    timelineLineWidth,
    dateLineSpace,
    dateLineSpaceUnit
  );

  console.log("data processing complete.");
  /******************************************************************************************************************/

  /* ADD EVENT LISTENERS */
  /******************************************************************************************************************/
  console.log("adding event listeners ...");

  addEventListeners(
    timeline,
    __retSetUp,
    __retFetchData
  );

  console.log("listeners added.");
  /******************************************************************************************************************/

  /* ANIMATE => RENDER */
  /******************************************************************************************************************/
  animate(timeline, __retSetUp, controls);

  /******************************************************************************************************************/

  console.log("initialization complete.");
};

/**********************************************************************************************************************/
/* END OF INITIALIZE FUNCTION */
