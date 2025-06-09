function setVerificationCodeExpiary(hours: number): Date {
  const verificationCodeExpiary = new Date();
  verificationCodeExpiary.setHours(verificationCodeExpiary.getHours() + hours);

  return verificationCodeExpiary;
}

export default setVerificationCodeExpiary;
