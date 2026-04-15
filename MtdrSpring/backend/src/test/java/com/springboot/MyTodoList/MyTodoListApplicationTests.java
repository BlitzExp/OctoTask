package com.springboot.MyTodoList;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class MyTodoListApplicationTests {

	@Test
	void applicationClassIsLoadable() {
		assertDoesNotThrow(MyTodoListApplication::new);
	}
}
