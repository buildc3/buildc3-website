import Spline from '@splinetool/react-spline';

const Homepage = () => {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <div className="h-full w-full" style={{ transform: 'translateY(5%)', transformOrigin: 'center center' }}>
        <Spline scene="https://prod.spline.design/0cyEg1aPz0Si15tV/scene.splinecode" />
      </div>
    </main>
  );
};

export default Homepage;
