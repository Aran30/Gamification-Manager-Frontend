<script src="<%= grunt.config('baseUrl') %>/js/gamificationelements.js"></script>
<script src="<%= grunt.config('baseUrl') %>/js/level.js"></script>

<script id="list-level" type="text/template">
      <a class="list-group-item list-group-item-action" data-toggle="modal" data-target="#buttonModal" data-levelnum="{{= number}}">

        <h6 class="list-group-item-heading"><i class="fa fa-tag" aria-hidden="true"></i> Level {{= number}} - {{= name}}</h6>
        <h6 class="list-group-item-heading"> </h6>
            <span class="tag tag-pill tag-success pull-xs-right">{{= pointValue}}</span>
        <p  class="{{ if(useNotification){ }}
                  text-success
                {{ } else{ }}
                text-danger
                {{ } }}
        "><i class="fa fa-comment-o" aria-hidden="true"></i> {{= notificationMessage }}</p>
      </a>


</script>

<div class="content-wrapper">
</div>

<script id="login-template" type="text/template">
<div id="login-alert" class="alert alert-info text-xs-center" role="alert">
  <h5>To use this widget, please select the Game ID in Game Widget.</h5>
  </div>
</script>

<script id="content-template" type="text/template">
<div class="row-offcanvas row-offcanvas-left">
  <div id="sidebar" class="sidebar-offcanvas">
    <div class="wrapper text-xs-center">
      <h6><strong>Level</strong></h6>
      <h6><strong>Manager</strong></h6>
      <br>
      <h6>Game ID</h6>
      <h6 id="title-widget"></h6>
      <br>
      <button type="button" class="btn btn-secondary btn-success bedit" onclick="addButtonListener()"><i class="fa fa-plus"></i></button> 
      <div class="push"></div>
    </div>

    <div class="footer">
      <div class="col-xs-12" >

        <div class="text-xs-center">
          <button type="button" class="btn btn-secondary btn-success bedit" onclick="refreshButtonListener()"><i class="fa fa-refresh"></i></button>
        </div>
        <br>
        <div class="text-xs-center">
          <button type="button" class="btn btn-secondary btn-success bedit" data-toggle="modal" data-target="#help" style="text-decoration: none;" title="Help"><i class="fa fa-question"></i></button>
        </div>
      </div>
        
    </div>
  </div>
  <div id="main">

    <div class="list-group">

    </div>

  </div>
</div>   

</script>

<!-- Help modal -->
<div class="modal fade" id="help">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h5 class="modal-title">Help</h5>
        </div>
        <div class="modal-body">
          <dl class="row">

            <dt class="col-xs-3 text-xs-center "><span class="tag tag-pill tag-success">5</span> </dt>
            <dd class="col-xs-9">Point value of level.</dd>
            

            <dt class="col-xs-3 text-xs-center text-success"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Green means the level use notification message.</dd>

            <dt class="col-xs-3 text-xs-center text-danger"><i class="fa fa-comment-o" aria-hidden="true" ></i></dt>
            <dd class="col-xs-9">Notification Message. Red means the level does not use notification message.</dd>
          </dl>
        
        </div>
      </div>
    </div>

</div>

  <div class="modal fade" id="buttonModal" tabindex="-1" role="dialog" aria-labelledby="buttonModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-xs-center" id="buttonModalLabel"></h5>
        </div>
        <div class="modal-body text-xs-center">
          <button type='button' class='btn btn-xs btn-warning'>Edit</button>
          <button type='button' class='btn btn-xs btn-danger'>Delete</button>

        </div>
      </div>
    </div>
  </div>

<div class="modal" id="modalleveldiv" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"></h4>
      </div>
      <div class="modal-body">
        

        <form method="POST" data-toggle="validator" enctype="multipart/form-data" id="modallevelform" name="gameId" class="form-horizontal" role="form">
            <div class="form-group row">
            <label for="level_num" class="col-xs-2 col-form-label">Level Number</label>
            <div class="col-xs-10">
              <input type="number" class="form-control" id="level_num" name="levelnum" placeholder="1" required>
              <small class="text-muted">
                Level number should be integer to identify the status of player
              </small>
            </div>

          </div>
          <div class="form-group row">
            <label for="level_name" class="col-xs-2 col-form-label">Level Name</label>
            <div class="col-xs-10">
              <input type="text" class="form-control" maxlength="20" id="level_name" name="levelname" placeholder="Starter Level">
            </div>
          </div>
          <!-- Form group end -->
          <div class="form-group row">
            <label for="level_point_value" class="col-xs-2 col-form-label">Value</label>
            <div class="col-xs-10">
                <input type="number" class="form-control" placeholder="0" id="level_point_value" name="levelpointvalue" value="0">
            </div>
          </div>


          <div class="form-group row">
            <label for="level_notification_message" class="col-xs-2 col-form-label">Notification</label>
            <div class="col-xs-10">
                <div class="input-group">
                    <span class="input-group-addon">
                      <input type="checkbox" aria-label="..." id="level_notification_check" name="levelnotificationcheck">
                    </span>
                    <input type="text" class="form-control" id="level_notification_message" name="levelnotificationmessage" placeholder="Notification Message">
                </div>
            </div>
          </div>
          <div class="form-group row">
              <div class="offset-xs-2 col-xs-10">
                  <button id="modallevelsubmit" type="submit" class="btn btn-primary" value="" ></button>
              </div>
          </div>
        </form>
        </div>

    </div>
  </div>
</div>
<div id="modalspinner" style="display: none">
    <div class="center">
        <img alt="" src="<%= grunt.config('baseUrl') %>/img/loader.svg" />
    </div>
</div>
