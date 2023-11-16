// import modules
import toColor from "../helper/toRGBAColor";
import TimeLine from "../../timeLine";

/* BACKGROUND */
/******************************************************************************************************************/
export default (timeline: TimeLine) => {
  let __retParticleBackground = null;
  // using particles.js library
  let particlesJSON = {
    particles: {
      number: {
        value: timeline.particlesBackground.amount,
        density: {
          enable: false,
          value_area: timeline.particlesBackground.density,
        },
      },
      color: {
        value: toColor(timeline.particleColor),
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: toColor(timeline.particleColor),
        },
        polygon: {
          nb_sides: 5,
        },
        /*image: {
          src: "img/github.svg",
          width: 100,
          height: 100,
        },*/
      },
      opacity: {
        value: timeline.particlesBackground.opacity,
        random: timeline.particlesBackground.opacityRandom,
        anim: {
          enable: true,
          speed: 0.2,
          opacity_min: 0,
          sync: false,
        },
      },
      size: {
        value: timeline.particlesBackground.size,
        random: timeline.particlesBackground.sizeRandom,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: toColor(timeline.particleColor),
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: timeline.particlesBackground.moveSpeed,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    retina_detect: false,
  };

  //@ts-ignore this method exists
  particlesJS("scene-container", particlesJSON);

  let backgroundColor = toColor(timeline.backgroundColor);

  //layer canvases for particles.js so mouse interaction like panning still works, but this makes mousehover effect unusable
  const canvas2 = document.getElementsByClassName("particles-js-canvas-el");
  const item = canvas2.item(0);

  if (item) {
    // not null (or undefined/NaN/''/0/false) check

    //@ts-ignore
    item.style.position = "absolute";
    //@ts-ignore
    item.style.backgroundColor = backgroundColor;

    const container = document.getElementById("scene-container");
    if (container) {
      // not null (or undefined/NaN/''/0/false) check
      if (container.children[2]) {
        //@ts-ignore
        container.children[1].style.position = "relative";
      }

      // an element cannot be present twice in de DOM, since we add the same element again at the first position the other one gets removed

      container.insertBefore(item, container.firstChild);
    }
  }

  return __retParticleBackground;
};

/******************************************************************************************************************/
/* END OF BACKGROUND */
