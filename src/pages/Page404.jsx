const Page404 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <container>
        <row className="justify-content-center">
          <col md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
              <p className="text-medium-emphasis float-start">The page you are looking for was not found.</p>
            </div>
            <div className="input-prepend">
              <input>{/* <CIcon icon={cilMagnifyingGlass} /> */}</input>
              <input type="text" placeholder="What are you looking for?" />
              <button color="info">Search</button>
            </div>
          </col>
        </row>
      </container>
    </div>
  );
};

export default Page404;
