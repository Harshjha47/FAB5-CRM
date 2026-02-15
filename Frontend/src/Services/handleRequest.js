import toast from "react-hot-toast";

/** 
 * @param {Function} apiFunc - The service function to call.
 * @param {string} successMsg - Custom success message.
 * @param {Function} callback - Optional function to run on success (e.g., refresh data).
 */

export const handleRequest = async (apiFunc, successMsg = "Success", callback = null) => {
  const tid = toast.loading("Processing...");
  try {
    const response = await apiFunc();
    const finalMsg = response?.data?.message || successMsg
    toast.success(finalMsg, { id: tid })
    if (callback) callback(response)
    return response;
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Something went wrong"
    toast.error(errorMsg, { id: tid })
    return null
  }
};