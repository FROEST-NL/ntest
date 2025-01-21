import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import ProductPhotography from './ProductPhotography.tsx';
import ProductPhotographyOrderForm from './ProductPhotographyOrderForm.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/productfotografie",
    element: <ProductPhotography />,
  },
  {
    path: "/order/productfotografie",
    element: <ProductPhotographyOrderForm />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);