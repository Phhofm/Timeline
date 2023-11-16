/**
 * Prototype for a THREE.js Visualization of the legal history timeline, developed by assignment of RWI @ University of Zurich
 * @author phhofm / https://phhofm.github.io
 */

/* IMPORTS */

/**********************************************************************************************************************/
import "particles.js";
import * as THREE from "three";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/main.css";
import "../styles/ext.css";
import init from "./modules/environment/initialize";
import strapiTimespan from "../src/classes/strapiTimespan";
import { Spinner } from "spin.js";
import strapiMeta from "./classes/strapiMeta";

/**********************************************************************************************************************/
/* END OF IMPORTS */

/* CONSTRUCTOR TimeLine Object*/

/**********************************************************************************************************************/
class TimeLine {
  // parameters

  url: string; // to fetch the data.
  container: HTMLElement; // where we display the scene.
  font: any; // font used for the 3D year numbers.
  onClick: any; // the function provided by the user what will happen if an event gets clicked, otherwise there is a default implementation that simply prints the details to the browser console.
  consoleOutput: boolean; // prints some information to the browser console like all the fetched objects from the url and which ones have been ignored because of mission data.
  scale: number; // this had been used to scale the app in case of it appearing too big or to small on for example mobile displays.
  eventPlaneMoveOverColor: number; // the color that the event changes into on mousehover, to indicate interactivity.
  eventPlaneColors: number[]; // an array of colors used for the types of events.
  disableConsoleOutput: boolean; // this can be set for production because threejs displays a lot of resizing messages etc. dependent on the display.
  bars: number; // how many lanes are generated on the timeline.
  fontFamily: string; // fonts used for the text displayed on the event plane in isometricview, or i think even font used for infotext when eventplane is clicked.
  spinner?: Spinner; // the loading icon used and shown at the beginning till all the data had been fetched and processed, we show background during this already, and build the timeline and event-geometries but then display it only after everything has finished to not show an unfinished confusing app.
  backgroundColor: number; // the color used for the background.
  particleColor: number; // color used for the particles in the background (particleWaveBackground).
  timelineColor: number; // color of the timeline-lines.
  sphereRadius: number; // how big the sphere-events (eventplanes in walkview) are.
  sphereWidthSegments: number = 5; // segments of sphere.
  sphereHeightSegments: number = 5; // segments of sphere.
  clickedSize: number = 2; // how big the sphere becomes when clicked (=active). dependent on the mode will resize back to normal when deselected or will stay this size permanently.
  cameraPositionX: number = 0; // position x of camera for the main scene.
  cameraPositionY: number = 12; // position y of camera for the main scene.
  cameraPositionZ: number = 100; // position z of camera for the main scene.
  cameraFov: number; // Fov of camera for the main scene.
  twitchingOnlyActiveObject: boolean; // the active (=selected) sphere will twitch around.
  twitchingExtent: number; // how extreme the twitching is, how far out the lines will twitch of the active sphere
  eventWireFrame: boolean; // the spheres are displayed as wireframes, can be deactivated to show filled out event-spheres but twitching not as cool anymore for my tase.
  inactiveSize: number; // the default size of the spheres (unselected).
  alternativeOnClickBehavior: boolean; // a different behavior, will make all other (unselected) spheres temporarily small and samecolored, to help the selected twitching big colorchangeds sphere to really stand/pop out.
  rotateScene: boolean = true; // try at natural camera-movement, makes the whole scene/app less static, works by rotating the timeline at the zeropoint. Of all the tries this works best and messes least with controls and it makes the whole scene less static.
  // not parameters but control values needed and sometimes overwritten by code

  onClickOverwrite: boolean = false; // not a parameter, derived from "onClick" method parameter.
  eventPlanePlacementRotater: number = 0; // to evenly distribute the planes generated.
  blobUpdateCounter: number = 0; // for the update function called from animate; to slow it down.
  finishedLoading: boolean = false; // this is set to true after all data fetched had been processed, then let spinner dissapear and show scene.
  spinnerStopped: boolean = false; // if we stopped the spinner.
  objectActive: boolean = false; // if we click a sphere, we set this as global, so we change all non-active spheres.
  activeObject: THREE.Mesh | null = null; // to track which of the objects is the active one.
  animationFrame: number = 0; // i think i needed this for the particle threejs background to stop and restart the animation so that when we change the color of the particles in the controls, we stop the animation, rebuild the background and restart the animation for the waves.
  eventTypes: string[] = []; // gets derived from the fetched data, then we can build control filters.
  timelineLineHeight: number = 0; // how far out the timeline goes, it should derive this from the latest date from data fetches.
  eventPlanesOriginalColor: any[] = []; // stores the color of the sphere before it changes it with onhover so it can be changed back to its original color afterwards.
  eventPlanes: THREE.Mesh[] = []; // the event planes derived from the data fetched.
  eventTypesValues: string[] = [];
  background: number = 1; // the background chosen, if it is one of the particleJS ones or the threejs one, for the threejs one we create a separate scene with its own camera and layer them, otherwise with the particleJS backgrounds we layer the canvases in the DOM itself.
  _showAllRelatedCurves: boolean = false; // for controllers, show all related Curves
  _allRelatedCurves: any; // store all related Curves to add or remove from scene when controlled
  currentTimePeriod: string = ""; // as above
  indexedArrayDefaultEvents: { [key: string]: number } = {}; // this contains the default events, the epochs, when we move the camera in eventlisteners, on mouseup, we check where the camera is and which timeperiod we are in. the key is the timeperiod, the number is the startZCoordinate in the world of this event
  rightEventObjects: strapiTimespan[] = [];
  metaEventObjects: strapiMeta[] = [];

  // backgroundcontrols defaults, these (or most of them) can be adjusted in the controls

 particlesBackground = {
    amount: 40,
    density: 289.1476416322727,
    opacity: 1,
    opacityRandom: true,
    size: 2,
    sizeRandom: true,
    moveSpeed: 0.1,
    onHover: false, // these interactivity parameters currently wont work because of the canvas layering we are doing, we catch mouseevents for the threejs in the foreground already. disabled in controls.
    onClick: false, // disabled in controls.
    onHoverDistance: 53.91608391608392, // disabled in controls.
  };

  // constructor with default values
  constructor({
    spinner,
    url,
    container,
    font,
    onClick,
    consoleOutput = false,
    scale = 1,
    eventPlaneMoveOverColor = 0xffffff,
    eventPlaneColors = [0x0074d9, 0xb10dc9, 0xffdc00, 0xff4136],
    disableConsoleOutput = false,
    bars = 4,
    fontFamily = "Impact, Charcoal, sans-serif",
    backgroundColor = 0x111111,
    timelineColor = 0x7fdbff,
    particleColor = 0x7fdbff,
    cameraFov = 25,
    sphereRadius = 1,
    sphereWidthSegments = 50,
    sphereHeightSegments = 15,
    clickedSize = 2,
    cameraPositionX = 0,
    cameraPositionY = 16,
    cameraPositionZ = 100,
    twitchingOnlyActiveObject = true,
    eventWireFrame = true,
    inactiveSize = 0.4,
    alternativeOnClickBehavior = true,
    twitchingExtent = 0.12,
    background = 1,
  }: {
    // differentiating between mandatory and optional parameters and assigning types
    spinner?: Spinner;
    url: string;
    container: HTMLElement;
    font: any;
    memoryMode?: boolean;
    onClick?: any;
    disableEventShadows?: boolean;
    consoleOutput?: boolean;
    scale?: number;
    portraitScale?: number;
    eventPlaneLimit?: number;
    eventPlaneMoveOverColor?: number;
    eventPlaneColors?: number[];
    disableConsoleOutput?: boolean;
    filledDefaultPlanes?: boolean;
    bars?: number;
    fontFamily?: string;
    backgroundColor?: number;
    timelineColor?: number;
    particleColor?: number;
    cameraFov?: number;
    sphereRadius?: number;
    sphereWidthSegments?: number;
    sphereHeightSegments?: number;
    clickedSize?: number;
    cameraPositionX?: number;
    cameraPositionY?: number;
    cameraPositionZ?: number;
    twitching?: boolean;
    twitchingOnlyActiveObject?: boolean;
    eventWireFrame?: boolean;
    inactiveSize?: number;
    alternativeOnClickBehavior?: boolean;
    twitchingExtent?: number;
    background?: number;
  }) {
    this.spinner = spinner;
    this.url = url;
    this.container = container;
    this.font = font;
    this.onClick = onClick;
    this.consoleOutput = consoleOutput;
    this.scale = scale;
    this.eventPlaneMoveOverColor = eventPlaneMoveOverColor;
    this.eventPlaneColors = eventPlaneColors;
    this.disableConsoleOutput = disableConsoleOutput;
    this.bars = bars;
    this.fontFamily = fontFamily;
    this.backgroundColor = backgroundColor;
    this.timelineColor = timelineColor;
    this.particleColor = particleColor;
    this.cameraFov = cameraFov;
    this.sphereRadius = sphereRadius;
    this.sphereWidthSegments = sphereWidthSegments;
    this.sphereHeightSegments = sphereHeightSegments;
    this.clickedSize = clickedSize;
    this.cameraPositionX = cameraPositionX;
    this.cameraPositionY = cameraPositionY;
    this.cameraPositionZ = cameraPositionZ;
    this.twitchingOnlyActiveObject = twitchingOnlyActiveObject;
    this.eventWireFrame = eventWireFrame;
    this.inactiveSize = inactiveSize;
    this.alternativeOnClickBehavior = alternativeOnClickBehavior;
    this.twitchingExtent = twitchingExtent;
    this.background = background;
  }

  build = () => {
    console.log("build timeline object");

    if (this.onClick === undefined) {
      // if the user has not passed an onClick function as a parameter.
      this.onClickOverwrite = true;
    }
    init(this).then(); // This is to start the whole application, we ignore promise returned.
  };
}

/**********************************************************************************************************************/
/* END OF CONSTRUCTOR TIMELINE OBJECT*/

export default TimeLine; // export this object
