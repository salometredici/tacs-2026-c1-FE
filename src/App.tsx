import {FC} from "react";
import AppRouter from './app/router/AppRouter'
import { AppProvider } from './app/context/AppContext'

const App: FC = () => {
  return (
    <>
    <AppProvider>
      <div className='tacs-front-container'>
        <AppRouter/>
      </div>
    </AppProvider>
    </>
  );
}

export default App;
