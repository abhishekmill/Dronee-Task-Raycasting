import React from "react";
// Create a simple React component called FizzBuzzList that:
// 	•	Renders numbers from 1 to 20.
// 	•	For each number:
// 	•	If divisible by 3, display “Fizz”
// 	•	If divisible by 5, display “Buzz”
// 	•	If divisible by both 3 and 5, display “FizzBuzz”
// 	•	Otherwise, display the number itself
const FizzBuzzList = () => {
  return (
    <div>
      {Array.from({ length: 21 }).map((item, idx) => (
        <>
          {(idx + 1) % 3 == 0 ? (
            <div>fizz</div>
          ) : (idx + 1) % 5 == 0 ? (
            <div>Buzz</div>
          ) : (idx + 1) % 5 == 0 && (idx + 1) % 3 == 0 ? (
            <div>FizzBuzz</div>
          ) : (
            <div>{idx + 1}</div>
          )}
        </>
      ))}
    </div>
  );
};

export default FizzBuzzList;
