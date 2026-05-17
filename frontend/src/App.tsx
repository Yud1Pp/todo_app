import { TodoProvider } from './context/TodoContext';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <TodoProvider>
      <Home />
    </TodoProvider>
  );
}

export default App;