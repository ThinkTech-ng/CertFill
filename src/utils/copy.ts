import { toast } from 'sonner';

export function copyToClipboard(text, msg?: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard!');
        toast.success(msg || 'Copied to clipboard.');
      })
      .catch((err) => {
        toast.error('Could not copy to clipboard.');
        console.error('Failed to copy text: ', err);
      });
  } else {
    fallbackCopyToClipboard(text, msg);
  }
}

export function fallbackCopyToClipboard(text: any, msg?: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      console.log(msg || 'Text copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard try again.');
    }
  } catch (err) {
    console.error('Fallback: Unable to copy text: ', err);
    toast.error('Unable to copy to clipboard.');
  }
  document.body.removeChild(textarea);
}
