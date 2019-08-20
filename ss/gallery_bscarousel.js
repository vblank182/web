$(function() {  // Document Ready event
    generateCarousel()
});


function generateCarousel() {
    // Construct nested array of [file path, item name, description] arrays.
    // Item name will be displayed in carousel overlay(?). Description will be displayed in alt text.
    images = [ ["img_one.jpg", "Name 1", "Product description 1"],
               ["img_two.jpg", "Name 2", "Product description 2"],
               ["img_three.jpg", "Name 3", "Product description 3"],

             ];

    // Add images to carousel
    for (var n = 0; n < images.length; n++) {

        // Add "active" class tags to first image
        if (n == 0) {
            c_act = ' class="active"';
            act = ' active';
        }
        else {
            c_act = '';
            act = '';
        }

        html_ind = '<li data-target="#carouselIndicators" data-slide-to="' + n + '"' + c_act + '></li>';
        html_img = '<div class="carousel-item' + act + '"> <img src="img/' + images[n][0] + '" class="d-block w-100 carousel-image" alt="' + images[n][2] + '"> </div>'

        $(".carousel-indicators").append(html_ind);  // Add new indicator entry
        $(".carousel-inner").append(html_img);  // Add new image
    }
}
