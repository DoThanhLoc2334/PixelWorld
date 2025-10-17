
import CanvasView from './components/CanvasView'
import {Application, extend} from '@pixi/react'
import {Container, Graphics} from "pixi.js"
import { useRef, useCallback } from 'react'


extend({
  Container,
  Graphics
})


function App(){
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CanvasView></CanvasView>
    </div>
  )
}

export default App

