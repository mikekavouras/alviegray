import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { useEffect} from 'react'
import { 
  Bodies,
  Common,
  Composite,
  Composites,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vertices,
} from 'matter-js'


export default function Home() {
  useEffect(() => {
    Common.setDecomp(require('poly-decomp'));
    const engine = Engine.create()
    const world = engine.world
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false,
          background: 'transparent',
        }
    });

    Render.run(render)

    const runner = Runner.create()
    Runner.run(runner, engine)

    const triangle = Vertices.fromPath('30 0 60 60 0 60')
    const star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38')
    const rectangle = Vertices.create([
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 100 },
      { x: 0, y: 100 },
    ])


    const colors = ['#56A7E9', '#E9565E', '#E9E256']
    const addShape = (x, y) => {
      var color = Common.choose(colors);
      const shape = Common.choose([triangle, star, rectangle])
      const angle = shape === star ? 0 : Math.floor(Math.random() * 6)
      const body = Bodies.fromVertices(x, y, shape, {
        restitution: 0.6,
        angle: angle,
        render: {
          fillStyle: color,
          strokeStyle: color,
          lineWidth: 1
        }
      }, true);
      Composite.add(world, body)
    }
    document.body.addEventListener('click', function(e) {
      addShape(e.pageX, e.pageY)
    }, false)
    document.body.addEventListener('touchstart', function(e) {
      const touch = e.touches[0]
      addShape(touch.pageX, touch.pageY)
    }, false)

    // Add walls
    Composite.add(world, [
      Bodies.rectangle(window.innerWidth / 2.0, 0, window.innerWidth, 10, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(window.innerWidth / 2.0, window.innerHeight + 5, window.innerWidth, 10, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(-20, window.innerHeight / 2.0, 50, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(window.innerWidth + 20, window.innerHeight / 2.0, 50, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } }),
    ])

    // add mouse control
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
      }
    });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    Render.lookAt(render, {
      min: {x: 0, y: 0},
      max: {x: window.innerWidth, y: window.innerHeight},
    })

    const image = new Image()
    image.src = '/preview.jpeg'
  })

  return (
    <div className="container">
      <Head>
        <title>Alvie Gray</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" /> 
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" /> 
        <link href="https://fonts.googleapis.com/css2?family=Sigmar+One&display=swap" rel="stylesheet" />
        <meta property="og:title" content="Alvie Gray" />
        <meta property="og:image" content="/preview.jpeg" />
      </Head>

      <main>
        <Header title="Alvie Gray" />
      </main>
    </div>
  )
}
