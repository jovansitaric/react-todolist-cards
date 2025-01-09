import Form from './components/Form'
import Products from './components/Products'
import { Link } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <>
      <Form />
      <Products />
      <Link to="/todo" className='cta top-right'>Todo list</Link>
    </>
  )
}
