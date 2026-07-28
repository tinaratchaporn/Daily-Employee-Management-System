import "./About2.css";
import Nam from "../../Images/Nam.png";
import tin from "../../Images/tin.jpg";


function About2() {
  return (
    <div className="about-container">
      <h1 className="about-title">About the Developers</h1>
      <div className="developer">
        <div className="developer-info">
          <img className="developer-img" src={Nam} alt="Developer 1" />
          <h2 className="developer-name">ศุภลักษณ์ จันทร์มา 65058688</h2>
          <p className="developer-course">คณะเทคโนโลยีสารสนเทศ</p>
          <p className="developer-major">สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์ ชั้นปีที่ 3</p>
        </div>
        <div className="developer-info">
          <img className="developer-img" src={tin} alt="Developer 2" />
          <h2 className="developer-name">อรัชพร นาคมอญ 65057974</h2>
          <p className="developer-course">คณะเทคโนโลยีสารสนเทศ</p>
          <p className="developer-major">สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์ ชั้นปีที่ 3</p>
        </div>
      </div>
    </div>
  );
}

export default About2;
