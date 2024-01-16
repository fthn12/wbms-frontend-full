const Page500 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <container>
        <row className="justify-content-center">
          <col md={6}>
            <span className="clearfix">
              <h1 className="float-start display-3 me-4">500</h1>
              <h4 className="pt-3">Houston, we have a problem!</h4>
              <p className="text-medium-emphasis float-start">
                The page you are looking for is temporarily unavailable.
              </p>
            </span>
            <div className="input-prepend">
              <div>{/* <CIcon icon={cilMagnifyingGlass} /> */}</div>
              <input type="text" placeholder="What are you looking for?" />
              <button color="info">Search</button>
            </div>
          </col>
        </row>
      </container>
    </div>
  );
};

export default Page500;
