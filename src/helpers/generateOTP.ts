function generateOTP(min: number, max: number): string {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export default generateOTP;
