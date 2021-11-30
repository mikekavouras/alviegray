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

    const arrow = Vertices.fromPath('40 0 40 20 100 20 100 80 40 80 40 100 0 50')
    const star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38')
    const rectangle = Vertices.create([
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 100 },
      { x: 0, y: 100 },
    ])

    const addShape = (x, y) => {
      var color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
      const shape = Common.choose([arrow, star, rectangle])
      const body = Bodies.fromVertices(x, y, Common.choose([arrow, star, rectangle]), {
        restitution: 0.7,
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
      Bodies.rectangle(window.innerWidth / 2.0, window.innerHeight, window.innerWidth, 10, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(0, window.innerHeight / 2.0, 50, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } }),
      Bodies.rectangle(window.innerWidth, window.innerHeight / 2.0, 50, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } }),
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
  })

  return (
    <div className="container">
      <Head>
        <title>Alvie Gray</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" /> 
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" /> 
        <link href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <main>
        <Header title="Alvie Gray" />
      </main>
    </div>
  )
}
