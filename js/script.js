var rankLimit = 5;

function validate() {
	var $countLabel = $('#counterRanked'),
		rankedVal = $('#tasks .ranked').length;

	$countLabel.html(rankedVal);

	//resets
	$('.counter').removeClass('text-danger');
	$('.btnProceed').removeAttr('disabled');

	if (rankedVal < rankLimit) { //not enough ranked
		$('.btnProceed').prop('disabled', true);
	} else if (rankedVal > rankLimit) { //too many ranked
		$('.counter').addClass('text-danger');
		$('.btnProceed').prop('disabled', true);
	} else {

	}

}

//do stuff
$(function() {

	//also has an inline style to limit fade effect on load
	$('#instructionsModal').modal('show');

	//get the content of our task list, stick it on the page
	$.getJSON('../tasks.json', function(data) {
	  
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
		$('#tasks .dropdown').on('show.bs.dropdown', function () {

			var $item = $(this);

		  	if (!$item.find('li').length) {
				$(this).append(
		  			'<ul class="dropdown-menu ranks">' +
					    '<li><a href="#" class="rank" data-ranktext="1st"><strong>Most</strong> important</a></li>' +
					    '<li><a href="#" class="rank" data-ranktext="2nd">2nd most important</a></li>' +
					    '<li><a href="#" class="rank" data-ranktext="3rd">3rd most important</a></li>' +
					    '<li><a href="#" class="rank" data-ranktext="4th">4th most important</a></li>' +
					    '<li><a href="#" class="rank" data-ranktext="5th">5th most important</a></li>' +
					    '<li role="separator" class="divider"></li>' +
					    '<li><a href="#">Unrank</a></li>' +
					'</ul>'
		  		);
		  	}
		});
		
	}); //end json done

	$('#tasks').on('click', '.ranks a', function() {
		
		var $rankLabel = $(this).closest('.task').find('.ranker');

		if ($(this).hasClass('rank')) {
			var rankText = $(this).data('ranktext');

			$rankLabel.html(rankText).addClass('ranked')
		} else {
			$rankLabel.html('Rank').removeClass('ranked')
		}

		validate();

	});

});
//end do stuff