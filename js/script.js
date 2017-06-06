//golden var. drives validation and ranking options.
var rankLimit = 5;

//make an array of ranks up to our defined limit.
var rankArr = [];
for (var i = 0; i != rankLimit; i++){
  rankArr.push(i)
}
//buuuuttt... we don't want to have '0th' as an option... let's kill the first array item and append one to the end. 
rankArr.shift(); //remove '0'
rankArr.push(rankLimit); //add one to end
//Is this hacky?? sorry internet :s

function dropdownContent() {

	var content = $('<ul />').addClass('dropdown-menu ranks');

	//really want it to be clear that the first item is the MOST important one
	content.append(
	    	'<li><a href="#0" class="rank" data-ranktext="1st"><strong>Most</strong> important</a></li>');

	//then loop out the rest
    for (var i = 1; i < rankLimit; i++) {
	    content.append(
	    	'<li>' +
	    		'<a href="#0" class="rank" data-ranktext="' + ordinalise(rankArr[i]) + '">' + 
	    			ordinalise(rankArr[i]) + ' most important' +
    			'</a>' +
			'</li>');
	}

	//separator and 'unrank' option
	content.append(
		'<li role="separator" class="divider"></li>' +
	    '<li><a href="#0">Unrank</a></li>');

	return content;
}

//helper for ordinals
//https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function ordinalise(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function allRankedCheck() {
	if ($('#tasks .ranked').length === rankLimit) {
		return true;
	} else {
		return false;
	}
}

//validatation / help cues
function validate() {
	var $countLabel = $('#counterRanked');

	//highlight duplicate ranks
	$('[class*="rank_"]').each(function() {
	    for (var i = 0; i < this.classList.length; i++) {
	        if (this.classList[i].indexOf('rank_') == 0) {

				var $thisRank = $('#tasks .' + this.classList[i]);
				if ($thisRank.length > 1) {
					$thisRank.removeClass('ranked').addClass('rankErr');
				} else {
					$thisRank.addClass('ranked').removeClass('rankErr');
				}
	        }
	    }    
	});

	//block submit if rank duplicates and insufficient # of ranks
	if (!allRankedCheck()) {
		$('.btnProceed').prop('disabled', true);
	} else {
		$('.btnProceed').removeAttr('disabled');
	}

	//too many ranked - status label
	if (rankedVal  > rankLimit) {
		$('.counter').addClass('text-danger');
	} else {
		$('.counter').removeClass('text-danger');
	}

	//update status label
	var rankedVal = $('#tasks .ranked').length;
	if ($('#tasks .rankErr').length > 0) {
		$('.statusDupes').show();
		$('.statusNormal').hide();
	} else {
		$('.statusDupes').hide();
		$('.statusNormal').show();
		$countLabel.html(rankedVal);
	}

}

//do stuff
$(function() {

	$('.rankLimit').html(rankLimit); //ensure UI refers to correct rank limit everywhere

	//also has an inline style to limit fade effect on load
	$('#instructionsModal').modal('show');

	//get the content of our task list, stick it on the page
	$.getJSON('tasks.json', function(data) {
	  
		var items = [];
		$.each(data, function(key, val) {
	    	items.push( "<li id='task_" + key + "' class='task list-group-item dropdown'>" +
	    		"<a href='#0' class='ranker' data-torank='" +  key + "' data-toggle='dropdown' role='button' aria-expanded='false'>Rank</a>" + 
	    		val + 
    			"</li>");
	  	});
	 
		$( '<ul/>', {
	  		'class': 'list-group task-list',
		    html: items.join('')
  		}).appendTo('#tasks');

  		$('#counterTotal').html(rankLimit);

	}).done(function () {

		//TODO: find a nice way to randomise it BEFORE it goes to the DOM
		var ul = $("#tasks .task-list");
	    var li = ul.children();
	    while (li.length) {
	        ul.append(li.splice(Math.floor(Math.random() * li.length), 1)[0]);
	    }

		//set up dropdown clicks now the things exist
		$('#tasks .dropdown').on('show.bs.dropdown', function () {
			var $item = $(this);

		  	if (!$item.find('li').length) {
				$(this).append(dropdownContent());
		  	}
		});
		
	}); //end json done

	$('#tasks').on('click', '.ranks a', function() {
		
		var $rankLabel = $(this).closest('.task').find('.ranker');

		//note, the empty removeClass clears all existing classes, e.g. ranked AND rank_1st so things don't get messy
		if ($(this).hasClass('rank')) {
			var rankText = $(this).data('ranktext');
			$rankLabel.html(rankText).removeClass().addClass('ranker ranked rank_' + rankText)
		} else {
			$rankLabel.html('Rank').removeClass().addClass('ranker');
		}

		validate();

	});

	//UUUGGHHH fix for dumb ios 'doublt tasp issue (look it up, it's stupid)
	$('#tasks').on('touchend', '.ranker', function() {
		window.location.href = $(this).attr("href");
	});

});
//end do stuff
