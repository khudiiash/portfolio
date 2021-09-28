import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {Text} from 'troika-three-text'
import {vPoint, fPoint, vProject, fProject, vStar, fStar, vTree, fTree, vAbout, fAbout} from './shaders'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import './style.css'


const LoadingManager = new THREE.LoadingManager()
const modelLoader = new GLTFLoader(LoadingManager)
modelLoader.setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))
// const gui = new dat.GUI()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
gsap.registerPlugin(ScrollToPlugin)

LoadingManager.onLoad = () => {
    gsap.to('.loading', {opacity: 0})
}
const logos = {
    'vue': '/images/vue.png',
    'react': 'https://logo.clearbit.com/reactjs.org',
    'three': 'https://logo.clearbit.com/threejs.org',
    'node': '/images/node.png',
    'mongo': '/images/mongo.png',
    'jquery': 'https://logo.clearbit.com/jquery.com',
    'phaser': 'https://logo.clearbit.com/phaser.io',
    'photoshop': 'https://logo.clearbit.com/photoshop.com',
}

const projects = [
    {title: 'Bookinist', frameworks: ['vue', 'node'], description: 'An application for book-lovers: searches for books, collects a lot of info about books, allows to download in multiple formats, provides reviews and recommendations.', texture: new THREE.TextureLoader().load('/images/bookinist.jpg'), url: 'https://bookinist-ua.herokuapp.com'},
    {title: 'Audiotika', frameworks: ['react', 'mongo', 'node'], description: 'A full-stack multiuser application for listening to audiobooks. Built with MERN stack.', texture: new THREE.TextureLoader().load('/images/audiotika.jpg'), url: 'https://audiotika.herokuapp.com'},
    {title: '3D Showcase', frameworks: ['three'], description: 'A Three JS world I created just to test some features.', texture: new THREE.TextureLoader().load('/images/showcase.jpg'), url: 'https://khudiiash-3d-showcase.netlify.app'},
    {title: '2D Game', frameworks: ['phaser'], description: 'A demo of a massive 2D game I am developing. Built using Phaser 3, Adobe Illustrator, and Adobe After Effects.', texture: new THREE.TextureLoader().load('/images/game.jpg'), url: 'https://khudiiash-game-demo.netlify.app'},
    {title: 'Bring The Box', frameworks: ['three'], description: 'Original 3D game inspired by the spread of low quality delivery services during the coronavirus pandemic', texture: new THREE.TextureLoader().load('/images/box.jpg'),  url: 'https://bring-the-box.netlify.app'},
    {title: 'Essay Check App', frameworks: ['react'], description: 'A text-editing application capable of detecting and fixing academic writing issues, similar to Grammarly. This application is used by a number of specialists working in the sphere of academic writing.', texture: new THREE.TextureLoader().load('/images/essay.jpg'), url: 'https://quality-control.netlify.app'},
    {title: 'Landing Page', frameworks: ['jquery'], description: "This is my first landing page. It's a single-page application with scroll-based animations.", texture: new THREE.TextureLoader().load('/images/wooder.jpg'), url: 'https://project-wooder.netlify.app'},
    {title: '2048', frameworks: ['vue'], description: 'Classic 2048 game made with Vue JS', texture: new THREE.TextureLoader().load('/images/2048.jpg'), url: 'https://2048-vue.netlify.app'},
]
const uniforms = {
    uTime: {value: 0},
    uMouse: {value: new THREE.Vector3()},
    uOpacity: {value: 0},
    uSize: {value: 600},
    uTransparency: {value: 1}
}

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
const isMobile = window.innerWidth < window.innerHeight
let tree = null
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))
renderer.setClearColor('#111')
let titleTween, descriptionTween;


// Sphere
const sphere = new THREE.Points(
    new THREE.SphereBufferGeometry(1, 168, 168),
    new THREE.ShaderMaterial({vertexShader: vPoint, fragmentShader: fPoint, uniforms, transparent: true})
)
sphere.rotation.x = Math.PI / 2
const aScale = new Float32Array(sphere.geometry.attributes.position.array.length / 3)
sphere.geometry.attributes.position.array.forEach((v,i) => {
    if (i % 3 === 0) aScale[Math.floor(i / 3)] = Math.random()
})
scene.add(sphere)

// Stars
const starsN = 2_000_000
const starsGeometry = new THREE.BufferGeometry()
const starsPositions = new Float32Array(starsN * 3)
const starsTargets = new Float32Array(starsN * 3)
const starsScale = new Float32Array(starsN)
for (let i = 0; i < starsN; i++) {
    starsPositions[i * 3 + 0] = (Math.sin(i) + 30) * (Math.random() - .5) * 10
    starsPositions[i * 3 + 1] = (Math.random() - .5) * 2 + 10
    starsPositions[i * 3 + 2] = (Math.cos(i) + 30) * (Math.random() - .5) * 10

    starsTargets[i * 3 + 0] = (Math.random() - .5)
    starsTargets[i * 3 + 1] = (Math.random() - .5)
    starsTargets[i * 3 + 2] = (Math.random() - .5)
    starsScale[i] = Math.random()
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))
starsGeometry.setAttribute('aTarget', new THREE.BufferAttribute(starsTargets, 3))
starsGeometry.setAttribute('aScale', new THREE.BufferAttribute(starsScale, 1))
const stars = new THREE.Points(
    starsGeometry,
    new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
        vertexColors: true,
        vertexShader: vStar, 
        fragmentShader: fStar,
        uniforms,
    })
)
sphere.add(stars)


for (let i = 0; i < projects.length; i ++) {
    const project = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10,6),
        new THREE.ShaderMaterial({
            vertexShader: vProject, 
            fragmentShader: fProject, transparent: true, 
            uniforms: {...uniforms, 
                uTexture: {value: projects[i].texture},
                uSaturate: {value: .7}
            },
        }))
    
    project.position.x = Math.sin((i + 2) * .8) * 20
    project.position.z = Math.cos((i + 2) * .8) * 20

    project.lookAt(new THREE.Vector3())
    project.position.y = 0

    // Create title
    const title = new Text()

    // Set properties to configure:
    title.text = projects[i].title
    title.font = '/fonts/montserrat/Montserrat-Regular.ttf'
    title.anchorX = 'center'
    title.fontSize = .5
    title.position.y = 4.5
    title.color = 0xffffff
    title.rotation.z = Math.PI
    title.position.z = 2
    // title.material.opacity = 0;
    title.material.transparent = true;
    title.material.blending = 1;
    if (!isMobile) title.scale.setScalar(0)
    title.sync()
    project.add(title)

    project.frameworks = []
    project.title = title

    projects[i].frameworks.forEach((framework,i) => {
        const tech = new THREE.Mesh(new THREE.PlaneBufferGeometry(.75,.75), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(logos[framework])}))
        project.add(tech)
        tech.rotation.z = Math.PI
        tech.position.set(4.65 - (i * .9), 3.25, 1)
        project.frameworks.push(tech)
        if (!isMobile) tech.scale.setScalar(0)
    })
    projects[i].object = project
    sphere.add(project)


}

sphere.geometry.setAttribute( 'aScale', new THREE.BufferAttribute( aScale, 1 ) );

gsap.timeline()
    .from('nav div', {duration: 2, opacity: 0, xPercent: -100, stagger: .1, ease: 'power2.inOut'})
    .from(sphere.position, {duration: 2, z: -2}, '<')
    .from('#scroll-down',1, {opacity: 0})

// Model    
let controller, human, astronaut;
const pointsMat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    vertexColors: true,
    vertexShader: vTree, 
    fragmentShader: fTree,
    uniforms: {...uniforms, uSize: {value: 0}}
})

const aboutPointsMat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    vertexColors: true,
    vertexShader: vAbout, 
    fragmentShader: fAbout,
    uniforms: {...uniforms, uSize: {value: 0}}
})


modelLoader.load('/models/controller.glb', glb => {
    controller = new THREE.Object3D()
    glb.scene.traverse(c =>{
        if (c.isMesh) {
            c.updateMatrix()
            c.geometry.setAttribute( 'aScale', new THREE.BufferAttribute( aScale, 1 ) );
            controller.add(new THREE.Points(c.geometry, aboutPointsMat))
        }
    })
    controller.scale.setScalar(.3)
    controller.position.set(-8, 0, 30)
    if (isMobile) {
        controller.scale.setScalar(.2)
        controller.position.set(-6, -10, 20)
    }
    scene.add(controller)
})

modelLoader.load('/models/human.glb', glb => {
    human = new THREE.Object3D()
    glb.scene.traverse(c =>{
        if (c.isMesh) {
            c.updateMatrix()
            c.geometry.rotateX(-Math.PI / 2)
            c.geometry.setAttribute( 'aScale', new THREE.BufferAttribute( aScale, 1 ) );
            human.add(new THREE.Points(c.geometry, aboutPointsMat))
        }
        human.scale.setScalar(3)
        human.position.set(-15, -10, 25)
        if (isMobile) {
            human.scale.setScalar(2)
            human.position.set(4, -10, 25)
        }
        scene.add(human)
    })
})

modelLoader.load('/models/astronaut.glb', glb => {
    astronaut = new THREE.Object3D()
    glb.scene.traverse(c =>{
        if (c.isMesh) {
            c.updateMatrix()
            c.geometry.rotateX(-Math.PI / 2)
            c.geometry.setAttribute( 'aScale', new THREE.BufferAttribute( aScale, 1 ) );
            astronaut.add(new THREE.Points(c.geometry, aboutPointsMat))
        }
        astronaut.scale.setScalar(1.8)
        astronaut.position.set(8, 0, 20)
        if (isMobile) {
            astronaut.scale.setScalar(1)
            astronaut.position.set(3, -20, 20)
        }
        scene.add(astronaut)
    })
})
modelLoader.load('/models/tree.glb', glb => {
    tree = glb.scene.children[0]
    const g = tree.geometry
    g.rotateZ(Math.PI)
    g.scale(5,5,5)
    tree = new THREE.Points(tree.geometry, pointsMat)
    sphere.add(tree)
    tree.position.set(-40,20,-5)
    tree.position.y -= 10


})



// About
const about = "My passion in web development usually goes beyond ordinary HTML layouts. I love to create unusual things, extraordinary spaces, and interactive realities. To achieve these purposes, I prefer using the latest 2D and 3D technologies. At the same time, besides of esthetics, I love creating functional web applications that might be useful to many people. If you're looking for the same things, we might find a common language."
const aboutMesh = new Text()
aboutMesh.text = about
aboutMesh.font = '/fonts/montserrat/Montserrat-Regular.ttf'
aboutMesh.anchorX = 'center'
aboutMesh.maxWidth = isMobile ? window.innerWidth / 25 : 22

aboutMesh.fontSize = isMobile ? .8 : 1
aboutMesh.color = 0xffffff
// aboutMesh.rotation.z = -Math.PI
aboutMesh.rotation.x = -Math.PI / 2
aboutMesh.position.set(0, -20, 30)

scene.add(aboutMesh)



// Listeners
document.querySelector('.gmail').onclick = () => window.open('https://mail.google.com/mail/u/0/?fs=1&to=dmytro.khudiiash@gmail.com&su=SUBJECT&body=BODY&tf=cm', '_blank')
document.querySelector('.telegram').onclick = () => window.open('https://t.me/mitrey144', '_blank')
document.querySelector('.github').onclick = () => window.open('https://github.com/khudiiash', '_blank')
document.querySelector('.works').onclick = () => {
    gsap.to(window, 2, {scrollTo: {y: 1100}})
    gsap.to(aboutMesh.material, 1, {opacity: 0})
}
document.querySelector('.about').onclick = () => gsap.to(window, 3, {scrollTo: {y: 2000}})
document.querySelector('.contact').onclick = () => gsap.to(window, 4, {scrollTo: {y: 'max'}})
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
let startX, diffX = 0;
window.ontouchstart = (e) => {
    startX = e.touches[0].clientX
}
window.ontouchmove = (e) => {
    const x = e.touches[0].clientX
    diffX = startX - x
}
window.ontouchend = (e) => {
    diffX = 0
}
window.onresize = () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize( sizes.width, sizes.height )
}
document.onmousemove = e => {
    // Mouse for shader
    const x = e.clientX / (window.innerWidth / 2) - 1
    const y = e.clientY / (window.innerHeight / 2) - 1
    // Mouse for raycaster
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1; 
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    gsap.to(uniforms.uMouse.value, 1, {x, y})

    if (controller) gsap.to(controller.rotation, 1.5, {z: -x - .5, x: y * .5})
    if (human) gsap.to(human.rotation, 1.5, {z: -x - .5, x: y * .5})
    if (astronaut) gsap.to(astronaut.rotation, 1.5, {z: -x - .5, x: y * .5})
    if (window.scrollY) {
        gsap.to(camera.position, {x: 0})
        return
    }
    gsap.to(camera.position, {x: x * 2, y: -y * 2})
}

document.addEventListener('click', () => {
    if (!projects.some(p => p.hovered)) return
    window.open(projects.find(p => p.hovered).url, '_blank')
})

document.onscroll = e => {
    const {scrollY} = window
  

    if (scrollY) gsap.to(camera.position, {x: 0})
    if (scrollY / 60 < 20) {
        gsap.to(camera.position, {y: scrollY / 60})
        gsap.to(uniforms.uOpacity, {value: scrollY / 40})
        projects.map((p,i) => gsap.to(p.object.position, 1, {y: 0, stagger: .1}))
        gsap.to(uniforms.uTransparency, 1, {value: 1})
        gsap.to(aboutMesh.position, {z: 30})
        gsap.to(sphere.scale, 1, {x: 1, y: 1, z: 1})
        // if (sphere.userData.iY) gsap.to(sphere.rotation, 0, {y: sphere.userData.iY})
        sphere.children.map(c => gsap.to(c.material.uniforms.uOpacity, {value: 1}))
        if (controller) gsap.to(controller.position, 1, {z: 30})
        if (human) gsap.to(human.position, 1, {z: 30})
        if (astronaut) gsap.to(astronaut.position, 1, {z: 30})

    }
    else {
        if (!sphere.userData.iY) sphere.userData.iY = sphere.rotation.y
        projects.map((p,i) => gsap.to(p.object.position, 1, {y: -scrollY * .01, stagger: .1}))
        gsap.to(uniforms.uTransparency, 1, {value: 0})
        gsap.to(sphere.scale, 1, {x: scrollY * .002})
        sphere.children.map(c => gsap.to(c.material.uniforms.uOpacity, {value: 0}))

        gsap.to(sphere.rotation, 1, {y: '-=' + (scrollY * .000001)})
        gsap.to(aboutMesh.position, 1, {z: -scrollY * .009 + 10})

        
        if (isMobile) {
            if (controller) gsap.to(controller.position, 1, {z: -scrollY * .008 + 6})
            if (human) gsap.to(human.position, 1, {z: -scrollY * .008 + 20})
            if (astronaut) gsap.to(astronaut.position, 1, {z: -scrollY * .008 + 3})
        } else {
            if (controller) gsap.to(controller.position, 1, {z: -scrollY * .008 + 15})
            if (human) gsap.to(human.position, 1, {z: -scrollY * .008 + 25})
            if (astronaut) gsap.to(astronaut.position, 1, {z: -scrollY * .008 + 20})

        }



    }
    const mobile = window.innerWidth < window.innerHeight

    const worksTop = document.querySelector('nav div:nth-child(1)').offsetTop - (mobile ? 40 : 0)
    const aboutTop = document.querySelector('nav div:nth-child(2)').offsetTop - (mobile ? 40 : 0)
    const contactTop = document.querySelector('nav div:nth-child(3)').offsetTop - (mobile ? 40 : 0)

    const aSet = scrollY >= worksTop && scrollY >= aboutTop && scrollY >= contactTop
   

    if (scrollY > 400 && scrollY < 1200) {
        if (isMobile) projects.map(p => gsap.to(p.object.scale, .5, {x: 1, y: 1, z: 1}))
        document.querySelector('nav div:nth-child(1)').classList.add('hovered')
    }  else {
        if (isMobile) projects.map(p => gsap.to(p.object.scale, .5, {x: 0, y: 0, z: 0}))
        document.querySelector('nav div:nth-child(1)').classList.remove('hovered')
    }
    if (scrollY > 1200 && scrollY < 2700) {
        gsap.to(aboutMesh.material, 1, {opacity: 1})

        document.querySelector('nav div:nth-child(2)').classList.add('hovered')
    } else  document.querySelector('nav div:nth-child(2)').classList.remove('hovered')

    if (scrollY > 3400) {
        document.querySelector('nav div:nth-child(3)').classList.add('hovered')
        gsap.to(aboutMesh.material, 1, {opacity: 0})
        gsap.timeline()
            .to('.svg:not(.telegram)', 1, {scale: 1, ease: 'back', stagger: .2})
            .to('.telegram', 1, {scale: 1.15, ease: 'back'}, '<.4')
            .to('.contacts h2', 1, {opacity: 1}, '<.2')
    } else  {
        document.querySelector('nav div:nth-child(3)').classList.remove('hovered')
        gsap.timeline()
            .to('.svg:not(.telegram)', 1, {scale: 0, ease: 'back', stagger: .2})
            .to('.telegram', 1, {scale: 0, ease: 'back'}, '<.4')
            .to('.contacts h2', 1, {opacity: 0}, '<.2')
    }
    
    if (!aSet) {
        if (mobile) {
            gsap.to('nav div:nth-child(1)', 0, {y: scrollY < worksTop ? -scrollY : -worksTop, x: -scrollY * (window.innerWidth * .0003), scale: 1 - (scrollY / 700)})
            gsap.to('nav div:nth-child(2)', 0, {y: scrollY < aboutTop ? -scrollY : -aboutTop, x: scrollY * (window.innerWidth * .0006), scale: 1 - (scrollY / 700)})
            gsap.to('nav div:nth-child(3)', 0, {y: scrollY < contactTop ? -scrollY : -contactTop, x: scrollY * (window.innerWidth * .0012), scale: 1 - (scrollY / 700)})
        } else {
            gsap.to('nav div:nth-child(1)', 0, {y: scrollY < worksTop ? -scrollY : -worksTop, scale: 1 - (scrollY / 1000)})
            gsap.to('nav div:nth-child(2)', 0, {y: scrollY < aboutTop ? -scrollY : -aboutTop, x: scrollY * .22, scale: 1 - (scrollY / 1000)})
            gsap.to('nav div:nth-child(3)', 0, {y: scrollY < contactTop ? -scrollY : -contactTop, x: scrollY * .39, scale: 1 - (scrollY / 1000)})
        }
      
    } else {gsap.set('nav div:nth-child(3)', {y: -contactTop})}

    gsap.to('#scroll-down', {opacity: scrollY ? 0 : 1})
}
let oldElepasedTime = 0;


const tick = () => {
    requestAnimationFrame(tick)
    const elapsedTime = clock.getElapsedTime()
    // controls.update()
    raycaster.setFromCamera( mouse, camera );
    if (!isMobile) sphere.rotation.y -= uniforms.uMouse.value.x  * .01 || -.001
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    if ( projects.map(p => p.object).length) {
        const intersects = raycaster.intersectObjects( projects.map(p => p.object) );
        const cr = {v: 0}
        for ( let i = 0; i < intersects.length; i ++ ) {
            const {object} = intersects[i]
            const project = projects.find(p => p.object === object)
            if ((!project.hovered && scrollY / 60 < 20)) {
                gsap.to(object.material.uniforms.uSaturate, .4, {value: 1.2})
                gsap.to(object.title.scale, {x: 1, y: 1, z: 1})
                object.frameworks.map(f => gsap.to(f.scale, {x: 1, y: 1, z: 1, stagger: .1}))
                project.hovered = true
                document.querySelector('.project .title').innerText = project.title
                document.querySelector('.project .description').innerText = project.description
                titleTween?.kill()
                descriptionTween?.kill()
                titleTween = gsap.fromTo('.project .title', 1, {clipPath: 'inset(0 0 100% 0)'}, {clipPath:  'inset(0 0 0% 0)'})
                descriptionTween = gsap.fromTo('.project .description', 1, {clipPath: 'inset(0 0 100% 0)'}, {clipPath:  'inset(0 0 0% 0)'})
            }

        }
        if (!intersects.length && projects.some(p => p.hovered)) {
            const p = projects.find(p => p.hovered)
            p.hovered = false;
            const cr = {v: 0}
            gsap.to(p.object.material.uniforms.uSaturate, .4, {value: .7})
            gsap.to(p.object.title.scale, {x: 0, y: 0, z: 0})
            p.object.frameworks.map(f => gsap.to(f.scale, {x: 0, y: 0, z: 0, stagger: .1}))
            titleTween = gsap.to('.project .title', 1, {clipPath:  'inset(0 0 100% 0)', onComplete: () => document.querySelector('.project .title').innerText = ''})
            descriptionTween = gsap.to('.project .description', 1, {clipPath:  'inset(0 0 100% 0)', onComplete: () => document.querySelector('.project .title').innerText = ''})
        }
        
    }

    uniforms.uTime.value = elapsedTime
    // aboutMesh.position.y = elapsedTime
    const delta = elapsedTime - oldElepasedTime
    if (controller) controller.rotation.y = Math.sin(elapsedTime) * .1
    if (human) human.rotation.z = -elapsedTime * .1
    if (astronaut) astronaut.rotation.z = elapsedTime * .1
    renderer.render(scene, camera)
    oldElepasedTime = elapsedTime;
    if (diffX) gsap.to(sphere.rotation, 0,{y: '+=' + ((diffX) * .0001)})


}

tick()

