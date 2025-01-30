import { certificateFontFamily, certificateTextTitle } from "@/store/certificate"

export const EditCertificate = ()=>{

  const handleAddBox = (e: React.MouseEvent<HTMLDivElement>) => {
    if (box) return; // Prevent creating multiple boxes

    const containerRect = e.currentTarget.getBoundingClientRect();

    // Box dimensions (you can customize these)
    const boxWidth = 450;
    const boxHeight = 50;

    // Get the center of the clicked point
    const x = e.clientX - containerRect.left - boxWidth / 2;
    const y = e.clientY - containerRect.top - boxHeight / 2;

    setBox({ x, y, text: certificateTextTitle, width: boxWidth, height: boxHeight });
    console.log(x, y);
  };

  const handleTextChange = (text: string) => {
    setBox((prev) => (prev ? { ...prev, text } : null));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  const handleDragStart = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();

    console.log("Mouse down detected");

    const startX = e.clientX;
    const startY = e.clientY;

    const initialX = box?.x ?? 0;
    const initialY = box?.y ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      console.log("Mouse is moving...");

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newX = initialX;
      let newY = initialY;

      // Depending on the corner, update the position
      if (corner === "top-left") {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === "top-right") {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === "bottom-left") {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === "bottom-right") {
        newX = initialX + dx;
        newY = initialY + dy;
      }

      setBox((prev) => (prev ? { ...prev, x: newX, y: newY } : null));
    };
    const handleMouseUp = () => {
      console.log("Mouse up detected");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Attach event listeners to track mouse movements and release
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleSave = async () => {
    if (!certificate) {
      alert("Please upload a certificate.");
      return;
    }

    saveCertificateDetails();
    setPopupVisible(false); // Close the popup
    router.refresh(); // Refresh or navigate to another page
  };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-[1240px] max-w-[90%] h-[700px] max-h-[90%] bg-white flex flex-row justify-center gap-10 px-6 items-center ">
              <div className="flex flex-col gap-3">
                <div className="min-w-[315px] w-full flex gap-5">
                  <select
                    id="font-selector"
                    value={selectedFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="inputField block w-full flex-1"
                  >
                    <option value="" disabled>
                      Choose a font
                    </option>
                    {certificateFontFamily.map(({ class: fontClass, name }) => (
                      <option key={fontClass} value={fontClass}>
                        {name}
                      </option>
                    ))}
                  </select>
                <select
                  id="font-size-selector"
                  value={selectedFontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="inputField max-w-[75px] w-[50px]"
                >
                  {certificateFontSize.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                </div>{" "}

                <div></div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="saveButton h-[56px] max-w-[388px]"
                >
                  Save and Exit 
                </button>
              </div>

              <div className="overflow-hidden h-[373px] w-[527px] relative pdf-container">
                <iframe
                  src={`${certificateURL}#toolbar=0`}
                  className="w-full h-full border-0 "
                  title="PDF Preview"
                ></iframe>
                {!box && (
                  <div
                    onClick={handleAddBox}
                    className="absolute inset-0 bg-transparent"
                  ></div>
                )}

                {/* Render the box if it exists */}
                {box && (
                  <div
                    ref={boxRef}
                    className={`absolute p-2 text-black cursor-move text-sm font-bold ${
                      isFocused ? "border-2 border-blue-500 outline-none" : ""
                    } ${selectedFont} ${selectedFontSize}`}
                    style={{
                      top: `${box.y}px`,
                      left: `${box.x}px`,
                      width: `${box.width}px`,
                      fontSize: `${selectedFontSize}px`,
                    }}
                    onClick={handleFocus} // Set focus when clicking the box
                    onBlur={handleBlur} // Remove focus when clicking outside
                  >
                    {/* The box content */}
                    <input
                      type="text"
                      value={box.text}
                      onChange={(e) => handleTextChange(e.target.value)}
                      className="bg-transparent border-none focus:outline-none w-full text-center"
                    />

                    {/* Draggable corner points */}
                    {isFocused && (
                      <>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "top-left")}
                          className="absolute hover:bg-purple-600 -top-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "top-right")}
                          className="absolute hover:bg-purple-600 -top-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "bottom-left")}
                          onClick={(e) => handleDragStart(e, "bottom-left")}
                          className="absolute hover:bg-purple-600 -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) =>
                            handleDragStart(e, "bottom-right")
                          }
                          className="absolute hover:bg-purple-600 -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
    )
}