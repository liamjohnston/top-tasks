var rankLimit = 5;

function validate() {
	var $countLabel = $('#counterRanked'),
		rankedVal = $('#tasks .ranked').length,
		//todo: make better:
		allRankedOnce = ($('#tasks .rank_1st').length === 1 &&
						 $('#tasks .rank_2nd').length === 1 &&
						 $('#tasks .rank_3rd').length === 1 &&
						 $('#tasks .rank_4th').length === 1 &&
						 $('#tasks .rank_5th').length === 1);

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
	if (!allRankedOnce) {
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
	$countLabel.html(rankedVal);

}

//do stuff
$(function() {

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

		//randomise the order in the DOM... seems easier to do it after it's rendered :/
		var ul = $("#tasks .task-list");
	    var li = ul.children();
	    while (li.length) {
	        ul.append(li.splice(Math.floor(Math.random() * li.length), 1)[0]);
	    }

		//set up dropdown clicks now the things exist
		$('#tasks .dropdown').on('show.bs.dropdown', function () {
			var $item = $(this);

		  	if (!$item.find('li').length) {
				$(this).append(
		  			'<ul class="dropdown-menu ranks">' +
					    '<li><a href="#0" class="rank" data-ranktext="1st"><strong>Most</strong> important</a></li>' +
					    '<li><a href="#0" class="rank" data-ranktext="2nd">2nd most important</a></li>' +
					    '<li><a href="#0" class="rank" data-ranktext="3rd">3rd most important</a></li>' +
					    '<li><a href="#0" class="rank" data-ranktext="4th">4th most important</a></li>' +
					    '<li><a href="#0" class="rank" data-ranktext="5th">5th most important</a></li>' +
					    '<li role="separator" class="divider"></li>' +
					    '<li><a href="#0">Unrank</a></li>' +
					'</ul>'
		  		);
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

});
//end do stuff
