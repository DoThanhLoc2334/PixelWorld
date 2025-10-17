
import CanvasView from './components/CanvasView'

import {Container, Graphics} from "pixi.js"
import { useRef, useCallback } from 'react'
// import {Application, extend} from '@pixi/react'


// extend({
//   Container,
//   Graphics
// })


function App(){
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CanvasView />
    </div>
  )
}

export default App

