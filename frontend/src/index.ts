/**
 * Creating loading spinner, timeline object, starting application
 * @author phhofm / https://phhofm.github.io/
 */

// imports
import TimeLine from "./timeLine"; // import timeline
import { spinnerOptions } from "./modules/startUp/spinnerOptions"; // import spinner options like linesize etc. these options can be adapted in the module code.
import { Spinner } from "spin.js"; // import spinner for loading screen
import "spin.js/spin.css"; // import spinner stylesheet for animation
import Font from "../fonts/gentilis_regular.typeface.json"; // import Font to be used
import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/main.css";
import "../styles/ext.css";
import toRGBAColor from "./modules/helper/toRGBAColor";
import WEBGL from "./modules/helper/WebGL";
import strapiMeta from "./classes/strapiMeta";

// WEBGL check
if (!WEBGL.isWebGLAvailable()) {
  var warning = WEBGL.getWebGLErrorMessage();
  document.getElementById("scene-container")!.appendChild(warning);
  throw new Error("WEBGL not supported by this browser");
}

// variables
//const url: string = "https://rwi-itp01.uzh.ch/thier-mgr/_backend/get/latest/timeline/?target=test&get"; // url with data provided
const url: string = "http://lht.rwi.app"; // url with data provided
const container: HTMLElement | null = document.getElementById(
  "scene-container"
); // fetch container to hold the rendering mainScene
// loading screen Spinner. We load and display it before anything else.
if (container) {
  // not null (or undefined/NaN/''/0/false) check


  //  we load and show the spinner before everything else. If it is a mobile, we first display the button (in timeline.ts) and then show the spinner if clicked (when loading data)
  let spinner = new Spinner(spinnerOptions).spin(container);

  // add to metaOverview Div
  const metaOverview = document.getElementById('metaOverview');
  if (metaOverview) { // not null (or undefined/NaN/''/0/false) check

    // add the button for each metaevent with that body
    var button = document.createElement("button");
    button.style.color = "#4CAF50";
    button.style.backgroundColor = "transparent";
    button.style.borderRadius = "4px";
    button.style.border = "2px solid #4CAF50";
    button.style.padding = "0px 2px";
    button.innerHTML = "Metaevents";
    metaOverview.appendChild(button);

    // add onclick function to metaevent modal
    button.addEventListener("click", function () {
      // we simply use the same code and pass in an empty event (empty data) and connect it to every single metaevent there is, so it will display them all
      timelineWalkView.onClick({ title: "", startyear: "", endyear: "", content: "", metaevents: timelineWalkView.metaEventObjects });
    });
  }

  // add to aboutPage Div
  const aboutPage = document.getElementById('aboutPage');
  if (aboutPage) { // not null (or undefined/NaN/''/0/false) check

    // add the button for each metaevent with that body
    var button = document.createElement("button");
    button.style.color = "#aed6f1";
    button.style.backgroundColor = "transparent";
    button.style.borderRadius = "50%";
    button.style.border = "2px solid #aed6f1";
    button.style.padding = "0px 10px";
    button.innerHTML = "i";
    aboutPage.appendChild(button);

    // add onclick function to metaevent modal
    button.addEventListener("click", function () {
      let content = '<p> Die Legal History Timeline Webapplikation wurde am RWI UZH entwickelt. Sie visualisiert die Ereignisse der Rechtsgeschiche als interaktive Lernhilfe für die Studenten. <br/> <a href="https://rwi.app/timeline/">Website</a> </p> <br /> <p>Entwicklung<br /> Antonia Hartmann (Konzept, Daten)<br /> Philip Hofmann (Implementation)<br /><br />Tech Stack<br /> Docker, Strapi, THREE.js, Webpack, Spin.js, Particles.js, Timeline JS, PleaseRotate.js, Micromodal.js, Node.js, Typescript, NGINX, Gitlab CI/CD</p>';
      // we simply use the same code and pass in an empty event (empty data) and connect it to every single metaevent there is, so it will display them all
      timelineWalkView.onClick({ title: "About Historytimeline", startyear: "", endyear: "", content: content });
    });
  }


  // create timeline object
  // for more parameters to create the TimeLine object with specific parameters, have a look into the code (constructor of the object)
  const timelineWalkView = new TimeLine({
    spinner: spinner, // REQUIRED the spinner for the loading screen
    url: url, // REQUIRED set the url from where the data will be imported
    container: container, // REQUIRED set the container-selector which will hold the Three.js Scene
    font: Font, // REQUIRED pass the Font to be used for the 3D date elements
    disableConsoleOutput: true, // this will output a lot of additional information onto the browser console if enabled. Useful for development

    onClick: (data: any) => {
      // What will happen if an event gets clicked (show modal or redirect user etc). If this function is not provided, an alert message will be shown when an event is clicked.
      // default is image is empty
      let image = "";

      if (data.image && data.image.formats && data.image.formats.small && data.image.formats.small.url) {
        console.log(data.image.formats.small.url);
        image = url + data.image.formats.small.url;
      }
      // add title and years to modal text
      let text;
      // if there is a single date, only add a single date
      // open all links in separate tab/window so user does not need to rebuild application (slow) every time a link is visited
      if (data.startyear != data.endyear) {
        text = "<h1>" + data.title + " " + data.startyear + " - " + data.endyear + "</h1>" + data.content.replaceAll("<a href", "<a target=\"_blank\" href");
      } else {
        text = "<h1>" + data.title + " " + data.startyear + "</h1>" + data.content.replaceAll("<a href", "<a target=\"_blank\" href");
      }

      // generate modal body of the event
      let body =
        '<div class="modal-body">' +
        '<div class="container-fluid">' +
        '<div class="row">' +
        '<div class="col-sm-12">' +
        '<div class="row">' +
        '<div class="col image">' + "<img src=\"" + image + "\">" +
        "<p>" +
        text +
        " </p>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      // create modal
      const $modal = $(
        '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">' +
        '<div class="modal-content" style="border: 0px;">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="align-self: end;"><span aria-hidden="true" style="color: white;">&times;</span></button>' +
        '<div class="modal-body">' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
      );

      // display modal
      if (!$(".modal:visible").length) {
        $modal.find(".modal-body").replaceWith(body);
        $modal.modal("show");
        $modal[0].style.color = toRGBAColor(timelineWalkView.timelineColor);
      }

      // if there are metaevents connected to this event, we build buttons and the content
      if (data.metaevents && data.metaevents.length > 0) {

        // the function so that when we press back button and replace the content to generate the metaevent buttons anew
        let addMetaButtons = function () {

          // for each metaevent
          data.metaevents.forEach((element: any) => {
            // find connected object
            let metaEventObject: strapiMeta | undefined = timelineWalkView.metaEventObjects.find(metaeventobject => metaeventobject.id === element.id);
            // check if found
            if (metaEventObject) {
              // generate modal bodies
              let metaBody =
                '<div class="modal-body">' +
                '<div class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-sm-12">' +
                '<div class="row">' +
                '<div class="col">' + "<img src=\"" + "" + "\">" +
                "<p>" +
                metaEventObject.title +
                " </p>" +
                "<p>" +
                //@ts-ignore
                metaEventObject.content.replaceAll("<a href", "<a target=\"_blank\" href") +
                " </p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>";

              // add the button for each metaevent with that body
              var button = document.createElement("button");
              button.style.color = "#4CAF50";
              button.style.backgroundColor = "transparent";
              button.style.borderRadius = "4px";
              button.style.border = "2px solid #4CAF50";
              button.style.padding = "0px 2px";
              button.innerHTML = metaEventObject.title;
              // add onclick function to metaevent modal
              button.addEventListener("click", function () {
                $modal.find(".modal-body").replaceWith(metaBody);
                $modal.find(".modal-body").prepend(buttonBack);
              });
              // appent metaevent button to the events modal
              $modal.find(".modal-body").prepend("<br>");
              $modal.find(".modal-body").prepend("<br>");
              $modal.find(".modal-body").prepend(button);
            }
          });
        }

        // call the function to add metaevent buttons to modal
        addMetaButtons();

        // add Back button
        var buttonBack = document.createElement("button");
        buttonBack.innerHTML = "Back to Event";
        buttonBack.style.color = toRGBAColor(timelineWalkView.timelineColor);
        buttonBack.style.backgroundColor = "transparent";
        buttonBack.style.borderRadius = "4px";
        buttonBack.style.border = "2px solid " + toRGBAColor(timelineWalkView.timelineColor);
        buttonBack.style.padding = "0px 2px";

        buttonBack.addEventListener("click", function () {
          $modal.find(".modal-body").replaceWith(body);
          addMetaButtons();
        });
      }
    },
  });

  // build the object / start the whole process
  timelineWalkView.build();
}
