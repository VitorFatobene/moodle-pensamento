package moodle_pensamento.moodle.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moodle_pensamento.moodle.auth.dto.LoginRequestDTO;
import moodle_pensamento.moodle.auth.dto.LoginResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
