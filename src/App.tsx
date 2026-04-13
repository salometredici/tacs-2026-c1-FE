import {FC} from "react";
import AppRouter from './app/router/AppRouter'
import { AppProvider } from './app/context/AppContext'
import { UserProvider } from './app/context/UserContext'

const App: FC = () => {
  return (
    <>
    <UserProvider>
      <AppProvider>
        <div className='tacs-front-container'>
          <AppRouter/>
        </div>
      </AppProvider>
    </UserProvider>
    </>
  );
}

export default App;
