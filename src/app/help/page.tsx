import React from "react";
import Link from "next/link";

const Help = () => {
  return (
    <div>
      <h1>Help</h1>
      <p>For more information, please visit the following pages:</p>
      <ul>
        <li>
          <Link href="/privacy">
            <a>Privacy Policy</a>
          </Link>
        </li>
        <li>
          <Link href="/terms">
            <a>Terms and Conditions</a>
          </Link>
        </li>
      </ul>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or need further assistance, please contact us
        at:
      </p>
      <a href="mailto:support@byostory.com">support@byostory.com</a>
    </div>
  );
};

export default Help;
