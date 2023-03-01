export default function Bank(props) {
  return (
    <>
      <div className="name">{props.bank.Bank_Name}</div>
      <div className="name branch">{props.bank.Branch_Name}</div>
      <div className="address">{props.bank.Branch_Address}</div>

      {props.bank.day_closed != "" ? (
        <div className="close">סגור ב{props.bank.day_closed}'</div>
      ) : null}

      <div className="address type">סוג סניף: {props.bank.Branch_Type}</div>

      <a
        href={`https://www.google.co.il/maps/search/${props.bank.City} ${props.bank.Branch_Address}`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://www.pngplay.com/wp-content/uploads/12/GPS-Icon-PNG-Clip-Art-HD-Quality.png"
          alt=""
        />
      </a>

      {props.bank.Telephone != "" ? (
        <a href={"tel:" + props.bank.Telephone}>
          <img
            src="https://www.seekpng.com/png/detail/814-8147045_call-us-phone-icon-black-circle.png"
            alt=""
          />
        </a>
      ) : null}

      {props.bank.Handicap_Access == "כן" ? (
        <img
          src="https://www.nicepng.com/png/detail/119-1192777_assistive-technology-icon-accessibility-icon-white.png"
          alt=""
        />
      ) : null}
    </>
  );
}
