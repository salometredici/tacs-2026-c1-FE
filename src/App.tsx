import {FC} from "react";
import AppRouter from './app/router/AppRouter'
import { AppProvider } from './app/context/AppContext'
import { UserProvider } from './app/context/UserContext'
import { NotificationsProvider } from './app/context/NotificationsContext'

const App: FC = () => {
  return (
    <>
    <UserProvider>
      <NotificationsProvider>
        <AppProvider>
          <div className='tacs-front-container'>
            <AppRouter/>
          </div>
        </AppProvider>
      </NotificationsProvider>
    </UserProvider>
    </>
  );
}

export default App;
