// Function Format Phone Number
const formatPhoneNumber = (phoneNumber) => {
  phoneNumber = phoneNumber.replace(/\D/g, '');

  if (phoneNumber.startsWith('08')) {
    return '62' + phoneNumber.slice(1);
  }

  if (phoneNumber.startsWith('8')) {
    return '62' + phoneNumber.slice(0);
  }

  return phoneNumber;
};

export default formatPhoneNumber;
