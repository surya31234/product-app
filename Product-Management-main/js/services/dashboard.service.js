class DashboardService {
  constructor() {
    this.intervalId;
  }

  // function to toggle success message
  toggleSuccessMessage(message, duration = 3500) {
    const successMessageEl = document.getElementById("success-message");
    const successMessageP = document.querySelector("#success-message p");
    const progressBarEl = document.getElementById("progressBar");
    progressBarEl.style.width = "0%";
    successMessageP.innerHTML = message;
    successMessageEl.style.display = "flex";

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const startTime = new Date().getTime();

    this.intervalId = setInterval(frame, 10);
    function frame() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const progress = (elapsedTime / duration) * 100;

      if (progress >= 100) {
        successMessageEl.style.display = "none";
        clearInterval(this.intervalId);
      } else {
        progressBarEl.style.width = progress + "%";
      }
    }
  }
}

export default new DashboardService();
