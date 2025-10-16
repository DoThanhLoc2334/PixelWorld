
import CanvasView from './components/CanvasView'
import {Application, extend} from '@pixi/react'
import {Container, Graphics} from "pixi.js"
import { useRef, useCallback } from 'react'


extend({
  Container,
  Graphics
})


function App(){
  let parentref = useRef(null);
  let cell = useCallback((graphics: Graphics) => {graphics.clear()
              graphics.setFillStyle({ color: 'red' })
              graphics.rect(1, 50, 100, 100)
              graphics.fill()}, [])
  return (
    <div ref={parentref} style={{ width: "100vw", height: "100vh" }}>
      <Application resizeTo={parentref}>
        <pixiContainer>
          <pixiGraphics draw={cell}></pixiGraphics>
        </pixiContainer>
      </Application>

          

    </div>
  )
}

export default App

