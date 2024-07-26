import './app.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext.jsx';
import ProfilePage from './pages/AccountPage.jsx';
import PlacesPage from './pages/PlacePage.jsx';
import PlaceFromPage from './pages/PlaceFromPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

export function App() {
  return (
    <UserContextProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage />} />
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/account' element={<ProfilePage/>} />
          <Route path='/account/places' element={<PlacesPage/>} />
          <Route path='/account/places/new' element={<PlaceFromPage/>} />
          <Route path='/account/places/:id' element={<PlaceFromPage/>} />
          <Route path='/place/:id' element={<ProductPage/>} />
          <Route path='/account/bookings' element={<BookingsPage/>} />
          <Route path='/account/bookings/:id' element={<BookingPage/>} />
        </Route>
      </Routes>
    </Router>
    </UserContextProvider>
  );
}