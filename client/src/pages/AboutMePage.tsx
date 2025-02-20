import { FaUser } from 'react-icons/fa';  // Importing a generic user icon from react-icons

const AboutMePage = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">About Me</h2>
      
      <div className="d-flex justify-content-center mb-4">
        <FaUser size={100} /> {/* Big generic icon */}
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <p className="lead text-center">
            Hello! I'm a passionate developer with a strong background in front-end technologies such as HTML, CSS, and JavaScript.
            I love building responsive, user-friendly websites and applications. I have a strong background in back-end technologies,
            which you can <a href="/portfolio">check out here.</a>       
          </p>
          <p className="lead text-center">
            When I'm not coding, I enjoy reading, hiking, drawing, and more. My goal is to continue growing
            as a developer and continue making more exiciting and innovative projects. <a href="/contact-me">Feel free to reach out!</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;