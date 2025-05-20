document.addEventListener('scroll', () => {
    const video = document.getElementById('scroll-video');
    const scrollPosition = window.scrollY;
    const documentHeight = document.body.scrollHeight - window.innerHeight;

    const scrollFraction = scrollPosition / documentHeight;
    video.currentTime = scrollFraction * video.duration;
});
