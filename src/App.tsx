import {FC} from "react";
import AppRouter from './app/router/AppRouter'
import { AppProvider } from './app/context/AppContext'
import { UserProvider } from './app/context/UserContext'
import { NotificationsProvider } from './app/context/NotificationsContext'
import { AdminProvider } from './app/context/AdminContext'

const App: FC = () => {
  return (
    <>
    <AdminProvider>
      <UserProvider>
        <NotificationsProvider>
          <AppProvider>
            <div className='tacs-front-container'>
              <AppRouter/>
            </div>
          </AppProvider>
        </NotificationsProvider>
      </UserProvider>
    </AdminProvider>
    </>
  );
}

export default App;
