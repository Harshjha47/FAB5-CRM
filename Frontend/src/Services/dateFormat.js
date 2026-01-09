export const formatDate = (dateString) => {
  if (!dateString) return "N/A"; 

  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    month: 'short', // "Feb"
    day: '2-digit', // "06"
    year: 'numeric' // "2026"
  });
};