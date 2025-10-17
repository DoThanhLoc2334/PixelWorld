
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
  return (
    <div ref={parentref} style={{ width: "100vw", height: "100vh" }}>
    </div>
  )
}

export default App

