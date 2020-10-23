function Rotate()
{
  if("orientation" in screen) {
    if(document.documentElement.requestFullscreen) 
    {
      document.documentElement.requestFullscreen();
    } 
    else if( document.documentElement.mozRequestFullscreen ) 
    {
      document.documentElement.mozRequestFullscreen();
    } 
    else if( document.documentElement.webkitRequestFullscreen ) {
      document.documentElement.webkitRequestFullscreen();
    } 
    else {
      document.documentElement.msRequestFullscreen();
    } 

    screen.orientation.lock('landscape-primary');
  }
  
}