$(function() {  // Document Ready event


    generateCarousel()

});


function loadImages() {
    // Images are named as "galleryN.jpg"
    var all_images = [];

    var done = false;
    var n = 1;
    while (!done) {
        var imgpath = "img/gallery" + n.toString() + ".jpg";
        all_images.push();

        $.ajax({
            url: imgpath,
            type: 'HEAD',
            error: function() {
                // File does not exist
                done = true;
            },
            success: function() {}
        });

        n++;
    }

    return all_images;
}


function generateCarousel() {

    var all_images = loadImages();

    // First image
    html_ind_1 = '<li data-target="#carouselIndicators" data-slide-to="0" class="active"></li>';  // Add to carousel-indicators
    html_img_1 = '<div class="carousel-item active"> <img src="' + all_images[0] + '" class="d-block w-100 carousel-image" alt="Selphie\'s Stitches Product Photo"> </div>'  // Add to carousel-inner

    $(".carousel-indicators").append(html_ind_1);
    $(".carousel-inner").append(html_img_1);

    // Remaining images
    for (var n = 1; n <= all_images.length; n++) {
        html_ind = '<li data-target="#carouselIndicators" data-slide-to="' + n + '"></li>';
        html_img = '<div class="carousel-item"> <img src="' + all_images[n] + '" class="d-block w-100 carousel-image" alt="Selphie\'s Stitches Product Photo"> </div>'

        $(".carousel-indicators").append(html_ind);
        $(".carousel-inner").append(html_img);
    }
}
