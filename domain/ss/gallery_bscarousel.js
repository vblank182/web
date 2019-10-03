$(function() {  // Document Ready event
    generateCarousel()
});


function generateCarousel() {
    // Construct nested array of [file path, item name, [tags]] arrays.
    // Item name will be displayed in alt text.
    // Tag will be used for searching.
    images = [ ["img_gryffindor.png", "Gryffindor Hat", ["harrypotter", "hat"]],
               ["img_hufflepuff.png", "Hufflepuff Hat", ["harrypotter", "hat"]],
               ["img_slytherin.png", "Slytherin Hat", ["harrypotter", "hat"]],
               ["img_ravenclaw.png", "Ravenclaw Hat", ["harrypotter", "hat"]],
               ["img_hufflepuffscarf.jpg", "Hufflepuff Scarf", ["harrypotter", "scarf"]],
               ["img_pokeballhat.png", "Pokeball Hat", ["pokemon", "hat"]],
               ["img_luxuryball.jpg", "Luxury Ball Amigurumi", ["pokemon", "amigurumi"]],
               ["img_pokeballaw.png", "Pokeball Arm Warmer", ["pokemon", "armwarmer"]],
               ["img_nightvale.jpg", "Welcome to Nightvale", ["hat", "custom"]],
               ["img_unicornbow.png", "Unicorn Bow", ["bow"]],
               ["img_satellitebow.png", "Satellite Bow", ["bow"]],
               ["img_mickeyminniebows.png", "Mickey & Minnie Bows", ["bow"]],
               ["img_mickeyminnietsumbows.png", "Mickey & Minnie TsumTsum Bows", ["bow"]],
               ["img_gaypridehat.png", "Gay Pride Hat", ["pride", "hat"]],
               ["img_transprideaw.png", "Trans Pride Arm Warmer", ["pride", "armwarmer"]],
               ["img_transpridehat.png", "Trans Pride Hat", ["pride", "hat"]],
               ["img_fraydicebag.png", "Fraysexual Pride Dice Bag", ["pride", "dicebag"]],
               ["img_genderfluidbow.png", "Genderfluid Pride Bow", ["pride", "bow"]],
               ["img_nonbinarycupcozy.png", "Nonbinary Pride Cup Cozy", ["pride", "cupcozy"]],
               ["img_rainbowdash.png", "Rainbow Dash Hat", ["mlp", "hat"]],
               ["img_applejack.png", "Applejack Hat", ["mlp", "hat"]],
               ["img_fluttershy.png", "Fluttershy Hat", ["mlp", "hat"]],
               ["img_twilightsparkle.png", "Twilight Sparkle Hat", ["mlp", "hat"]],
               ["img_pinkiepie.png", "Pinkie Pie Hat", ["mlp", "hat"]],
               ["img_rarity.png", "Rarity Hat", ["mlp", "hat"]],
               ["img_vinylscratch.jpg", "Vinyl Scratch Hat", ["mlp", "hat"]],
               ["img_jaynehat.png", "Jayne Hat", ["firefly", "hat"]],
               ["img_customdicebag1.png", "Custom Red/Black Dice Bag", ["dicebag", "custom"]],
               ["img_customdicebag2.png", "Custom Blue/Green Dice Bag", ["dicebag", "custom"]],
               ["img_customdicebag3.png", "Custom Blue/White Dice Bag", ["dicebag", "custom"]],
               ["img_customdicebag4.png", "Custom Orange Dice Bag", ["dicebag", "custom"]],
               ["img_custombow1.png", "Custom Fairy & Dragon Bows", ["bow", "custom"]],
               ["img_custombow2.png", "Custom Cat Bow", ["bow", "custom"]],
               ["img_custom1.png", "Custom Blue/Purple Hat", ["hat", "custom"]],
               ["img_custom2.png", "Custom Purple/Teal Hat", ["hat", "custom"]],
               ["img_custom3.png", "Custom Blue/Grey Hat", ["hat", "custom"]],
               ["img_custom4.png", "Custom Cactus Hat w/ Bow", ["hat", "custom"]],
               ["img_sailorvenus.png", "Sailor Venus Hat", ["sailormoon", "hat"]],
               ["img_sailoruranus.png", "Sailor Uranus Hat", ["sailormoon", "hat"]],
               ["img_sailorsaturn.png", "Sailor Saturn Hat", ["sailormoon", "hat"]],
               ["img_sailorpluto.png", "Sailor Pluto Hat", ["sailormoon", "hat"]],
               ["img_sailorneptune.png", "Sailor Neptune Hat", ["sailormoon", "hat"]],
               ["img_sailormoon.png", "Sailor Moon Hat", ["sailormoon", "hat"]],
               ["img_sailormoon.png", "Sailor Moon Hat", ["sailormoon", "hat"]],
               ["img_sailormercury.png", "Sailor Mercury Hat", ["sailormoon", "hat"]],
               ["img_sailorjupiter.png", "Sailor Jupiter Hat", ["sailormoon", "hat"]],
               ["img_sailormars.png", "Sailor Mars Hat", ["sailormoon", "hat"]],
               ["img_sailorchibimoon.png", "Sailor Chibi Moon Hat", ["sailormoon", "hat"]],
               ["img_chibichibimoon.jpg", "Chibi Chibi Moon Hat w/ Bow", ["sailormoon", "hat"]],
               ["img_babyscouts.jpg", "Baby Sailor Scouts Hats", ["sailormoon", "hat"]],
               ["img_innersailorscouts.jpg", "Inner Sailor Scouts Hats", ["sailormoon", "hat"]],
               ["img_allsailorscouts.jpg", "All Sailor Scouts Hats", ["sailormoon", "hat"]],
               ["img_nbcsallybow.png", "Nightmare Before Christmas Sally Bow", ["bow", "custom"]],
               ["img_bobomb.png", "Bob-omb Hat", ["hat", "custom"]],
               ["img_bengalshat.png", "Bengals Hat", ["football", "hat", "custom"]],
               ["img_osuhat.png", "OSU Hat", ["football", "hat", "custom"]],
               ["img_michiganhat.png", "Michigan Hat", ["football", "hat", "custom"]],
               ["img_syracusehat.png", "Syracuse Hat w/ Bow", ["football", "hat", "custom"]],
               ["img_cupcozy.png", "Cup Cozies", ["cupcozy"]],
               ["img_jackskellington.png", "Jack Skellington Hat", ["hat", "custom"]],
               ["img_pilothat.jpg", "Pilot Hat", ["hat", "custom"]],
               ["img_booth.png", "Sales Booth", ["other"]],

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
        html_img = '<div class="carousel-item' + act + '"> <img src="img/' + images[n][0] + '" class="d-block w-100 carousel-image" alt="' + images[n][1] + '" title="' + images[n][1] + '"> </div>';

        $(".carousel-indicators").append(html_ind);  // Add new indicator entry
        $(".carousel-inner").append(html_img);  // Add new image
    }
}
