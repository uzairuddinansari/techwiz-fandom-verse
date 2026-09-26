import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../Redux/feature/ReviewSlice";

const Reviews = () => {
  const [nameVal, setnameVal] = useState("");
  const [Review, setReview] = useState("");
  const [countryCode, setCountryCode] = useState("PK");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    const newReview = {
      id: Date.now(),
      name: nameVal,
      review: Review,
      countryCode
    };

    dispatch(addReview(newReview));

    const oldReviews = JSON.parse(localStorage.getItem("websiteReviews") || "[]");
    const updatedReviews = [...oldReviews, newReview];

    localStorage.setItem("websiteReviews", JSON.stringify(updatedReviews));

    setnameVal("");
    setReview("");

    console.log("Review Saved:", newReview);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Name</label>

        <input type="text" value={nameVal} onChange={(e) => setnameVal(e.target.value)} />

        <label>Country</label>

        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
          <option value="PK">Pakistan</option>
          <option value="IN">India</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="AE">United Arab Emirates</option>
          <option value="SA">Saudi Arabia</option>
          <option value="TR">Turkey</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </select>

        <label>Reviews</label>

        <input type="text" value={Review} onChange={(e) => setReview(e.target.value)} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Reviews;
