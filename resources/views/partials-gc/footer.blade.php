<?php
use Illuminate\Support\Facades\DB;
$dateSaisie = DB::select('SELECT DateSystem FROM taux_et_date_systems ORDER BY id DESC LIMIT 1')[0];
$userInfo = DB::select('SELECT * FROM users WHERE id="' . Auth::user()->id . '"')[0];
?>

<!-- Footer avec effets modernes -->
<footer class="footer mt-auto" style="background: linear-gradient(135deg, #1a2632 0%, #0f1419 100%); border-top: 3px solid #20c997; position: relative; overflow: hidden;">
  
  <!-- Effet de vague décorative -->
  <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #20c997, #ffc107, #20c997); animation: shimmer 2s infinite;"></div>
  
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 py-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          
          <!-- Logo footer -->
          <div class="text-center text-md-start">
            <div class="d-flex align-items-center gap-2">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #20c997 0%, #198764 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-chart-line" style="color: white; font-size: 18px;"></i>
              </div>
              <div>
                <strong class="text-white" style="font-size: 16px;">AKIBA YETU</strong>
                <small class="text-muted d-block" style="font-size: 10px;">Gestion de crédit</small>
              </div>
            </div>
          </div>

          <!-- Informations centrales -->
          <div class="text-center">
            <div class="d-flex flex-wrap justify-content-center gap-3 gap-md-4">
              <div class="d-flex align-items-center gap-2">
                <i class="fas fa-user-circle" style="color: #20c997;"></i>
                <span class="text-white">{{ $userInfo->name }}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="fas fa-tag" style="color: #20c997;"></i>
                <span class="text-white">{{ $userInfo->role }}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="fas fa-calendar" style="color: #20c997;"></i>
                <span class="text-white">
                  {{ date('d/m/Y') }}
                </span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="fas fa-code" style="color: #20c997;"></i>
                <span class="text-white">AKIBA YETU</span>
              </div>
            </div>
          </div>

          <!-- Bouton retour haut -->
          <div class="text-center text-md-end">
            <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" 
                    style="background: rgba(32, 201, 151, 0.15); border: none; border-radius: 30px; padding: 8px 16px; color: #20c997; transition: all 0.2s ease; cursor: pointer;"
                    onmouseenter="this.style.backgroundColor='rgba(32, 201, 151, 0.3)'; this.style.transform='translateY(-2px)'"
                    onmouseleave="this.style.backgroundColor='rgba(32, 201, 151, 0.15)'; this.style.transform='translateY(0)'">
              <i class="fas fa-arrow-up me-1"></i>
              Haut de page
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center pb-3">
        <small class="text-muted" style="font-size: 11px;">
          <i class="fas fa-copyright me-1"></i> {{ date('Y') }} Akiba Yetu - Tous droits réservés
        </small>
      </div>
    </div>
  </div>
</footer>

<style>
  /* @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  } */
  
  .footer {
    transition: all 0.3s ease;
  }
  
  .footer:hover {
    box-shadow: 0 -8px 24px rgba(32, 201, 151, 0.15);
  }
  
  /* Animation pour les icônes */
  .footer .d-flex i {
    transition: all 0.2s ease;
  }
  
  .footer .d-flex:hover i {
    transform: scale(1.1);
    color: #ffc107 !important;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .footer .d-flex {
      flex-direction: column;
      text-align: center;
    }
    
    .footer .text-center {
      width: 100%;
    }
  }
</style>



<!-- jQuery footer-section -->
<script src="{{ asset('template/plugins/jquery/jquery.min.js') }}"></script>
<!-- jQuery UI 1.11.4 -->
<script src="{{ asset('template/plugins/jquery-ui/jquery-ui.min.js') }}"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
    $.widget.bridge('uibutton', $.ui.button)
</script>
<!-- Bootstrap 4 -->
<script src="{{ asset('template/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<!-- ChartJS -->
<script src="{{ asset('template/plugins/chart.js/Chart.min.js') }}"></script>
<!-- Sparkline -->
<script src="{{ asset('template/plugins/sparklines/sparkline.js') }}"></script>
<!-- JQVMap -->
<script src="{{ asset('template/plugins/jqvmap/jquery.vmap.min.js') }}"></script>
<script src="{{ asset('template/plugins/jqvmap/maps/jquery.vmap.usa.js') }}"></script>
<!-- jQuery Knob Chart -->
<script src="{{ asset('template/plugins/jquery-knob/jquery.knob.min.js') }}"></script>
<!-- daterangepicker -->
<script src="{{ asset('template/plugins/moment/moment.min.js') }}"></script>
<script src="{{ asset('template/plugins/daterangepicker/daterangepicker.js') }}"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="{{ asset('template/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js') }}"></script>
<!-- Summernote -->
<script src="{{ asset('template/plugins/summernote/summernote-bs4.min.js') }}"></script>
<!-- overlayScrollbars -->
<script src="{{ asset('template/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js') }}"></script>
<!-- AdminLTE App -->
<script src="{{ asset('template/dist/js/adminlte.js') }}"></script>
{{-- <!-- AdminLTE for demo purposes -->
<script src="{{ asset('template/dist/js/demo.js') }}"></script>
<!-- AdminLTE dashboard demo (This is only for demo purposes) -->
<script src="{{ asset('template/dist/js/pages/dashboard.js') }}"></script>
<script>
    new DataTable('#example');
</script> --}}
</body>

</html>
