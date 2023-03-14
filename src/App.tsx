import { Header, Services, Footer, Welcome, Loader, Transactions } from './components/index';

export default function App() {
  return (
    <div className="App min-h-screen">
      <div className="gradient-bg-welcome">
        <Header/>
        <Welcome/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>
    </div>
  );
}

