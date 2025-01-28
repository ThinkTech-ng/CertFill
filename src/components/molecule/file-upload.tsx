import React from "react";
interface FileUploadProps {
    label?: string;
    uploadText?: string
    onFileChange: (files: FileList | null)=> void
    accept: string
}
export const FileUpload: React.FC<FileUploadProps> = (props)=>{

    const inputId = React.useId()
    const inputRef = React.useRef(null)

  const handleUploadClick = () => {
    const input = inputRef.current as unknown as HTMLInputElement;
    if (input) {
      input.click(); // Trigger the file input programmatically
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onFileChange(event.target.files)
  }
    return (

        <div className="inputField flex flex-row justify-between items-center h-[50px] mt-4">
          <label className="truncase flex-1  max-sm:text-base">{props.label || 'Select File'}</label>
          <input
            type="file"
            name={inputId}
            onChange={handleFileChange}
            className="hidden"
            accept={props.accept}
            required
            ref={inputRef}
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="bg-black px-9 py-2.5 text-white rounded-lg text-xs"
          >
            {props.uploadText || "Upload"}
          </button>
        </div>
    )
}