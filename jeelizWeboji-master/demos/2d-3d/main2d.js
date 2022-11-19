let _SVGpupilLeft = null, _SVGpupilRight = null, _SVGhead = null;


function move_pupil(SVGpupil, dx, dy){
  JeelizWebojiSVGHelper.pos_SVGpath(SVGpupil, dx, dy);
}


function rotate_headZ(rz){
  JeelizWebojiSVGHelper.rot_SVGpath(_SVGhead, rz);
}


// entry point:
function main2d(){
  _SVGpupilLeft = document.getElementById('svgPupilLeft');
  _SVGpupilRight = document.getElementById('svgPupilRight');
  _SVGhead = document.getElementById('svgHead');

  JeelizWebojiSVGHelper.init({
    canvasId: 'jeelizFaceExpressionsCanvas2d',
    NNCPath: '../../dist/',
    hysteresis: 0.02, // bonus score for already selected expression. Against flickering
    isMirror: true,

    expressions: [ // list of uncorrelated expressions (for example the mouth is uncorrelated with the right eye)
      { // mouth. Inside a group each expression is an exclusive choice
        // the key of an expression is its CSS class. the value is the score class
        // the chosen expression is the one which has the higher score
        /*
        All factors are between 0 and 1. names:
          smileRight -> closed mouth smile right
          smileLeft  -> closed mouth smile left
          eyeBrowLeftDown -> eyebrow left frowned
          eyeBrowRightDown -> eyebrow right frowned
          eyeBrowLeftUp -> eyebrow left up (surprised)
          eyeBrowRightUp -> eyebrow right up (surprised)
          mouthOpen -> mouth open
          mouthRound -> mouth round
          eyeRightClose -> close right eye
          eyeLeftClose  -> close left eye
          mouthNasty   -> mouth nasty (upper lip raised)
        */
        svgMouthRound: function(ks){
           return 0.7 * ks.mouthRound - 0.1 * ks.mouthOpen - 0.2;
        },

        svgMouthOpen: function(ks){
           return 1.0 * ks.mouthOpen;
        },

        svgMouthRest:function(ks){
           return 0.45;
        },

        svgMouthNasty: function(ks){
           return ks.mouthNasty * 2.0 + 0.2 * ks.mouthOpen;
        },

        svgSmileLeft: function(ks){
            return ks.smileLeft - ks.smileRight;
        },

        svgSmileRight: function(ks){
            return ks.smileRight - ks.smileLeft;
        },

        svgSmile: function(ks){
           return (ks.smileRight + ks.smileLeft);
        }
      },

      { // left eye
        svgEyeLeftOpen: function(ks){
          return 1. - ks.eyeLeftClose;
        },
        svgEyeLeftClose: function(ks){
          return 1.5 * ks.eyeLeftClose;
        }
      },

      { // right eye
        svgEyeRightOpen: function(ks){
          return 1. - ks.eyeRightClose;
        },
        svgEyeRightClose: function(ks){
          return 1.0 * ks.eyeRightClose;
        }
      },

      { // left eyebrow
        eyeBrowLeftRest: function(ks){
          return 0.4;
        },
        eyeBrowLeftUp: function(ks){
          return ks.eyeBrowLeftUp;
        },
         eyeBrowLeftDown: function(ks){
          return 1.0 * ks.eyeBrowLeftDown;
        }
      },

      { // right eyebrow
        eyeBrowRightRest: function(ks){
          return 0.4;
        },
        eyeBrowRightUp: function(ks){
          return ks.eyeBrowRightUp;
        },
         eyeBrowRightDown: function(ks){
          return 1.0 * ks.eyeBrowRightDown;
        }
      }
    ], //end expressions[]

    rotationCallback: function(xyz){
      const rx = xyz[0], // head angle: rotation around X (look up/down)
          ry = xyz[1], // rotation around Y: look right/left
          rz = xyz[2]; // rotation around Z: head bending

      const dx = 12*ry, dy = -5+20*rx;
      move_pupil(_SVGpupilRight, dx,dy);
      move_pupil(_SVGpupilLeft, dx,dy);
      
      rotate_headZ(-rz*150);    
    }

  });
} //end main()


// entry point:
function main3d(){
  JeelizWebojiThreeHelper.init({
    isMirror: true,

    canvasThreeId: 'webojiCanvas',
    canvasId: 'jeelizFaceExpressionsCanvas3d',
    assetsParentPath: '../../../assets/3D/',
    NNCPath: '../../../dist/',

    // RACCOON:
    meshURL: 'meshes/fox11_v0.json',
    matParameters: {
      diffuseMapURL: 'textures/Fox_albedo.png',
      specularMapURL: 'textures/Fox_specular.png',
      flexMapURL: 'textures/Fox_flex.png'
    }, //*/

    // HUMAN CREEPY FACE:
    /*meshURL: 'meshes/faceCustom11_v0.json',
    matParameters: {
      diffuseMapURL: 'textures/skin.jpg'
    },  //*/

    position: [0, -80, 0],
    scale: 1.2
  });
}
// window.addEventListener('load', main2d);
// window.addEventListener('load', main3d);

// t.addEventListener((e)=>{
  //   window.
  // })
  // localStorage.setItem("value","2D");

  let xd = localStorage.getItem("value");

  if(xd=="2d"){
    window.addEventListener('load', main2d);
  }
  if(xd=="3d"){
    window.addEventListener('load', main3d);
  }

  function tgl(){
    
  let t = document.getElementById("myBtn");
  let val = localStorage.getItem("value");
  if(val==="2d"){
    localStorage.setItem("value","3d")
    location.reload()
    t.setAttribute('value',"3d");
  }
  else if(t.value==="3d") {
    localStorage.setItem("value","2d")
    t.setAttribute('value',"2d");
    location.reload()
    window.addEventListener('load', main3d);

  }
}